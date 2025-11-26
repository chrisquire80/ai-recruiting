
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CVData, Candidate } from '../types';
import { redactPII } from '../utils/privacy';

// --- CACHING LAYER ---
// Simple in-memory/local storage cache to prevent duplicate expensive AI calls
// In production, this would use Redis or a database.
const CACHE_KEY_PREFIX = 'scabbio_ai_cache_';

const getFromCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + key);
    if (cached) {
      const { data, expiry } = JSON.parse(cached);
      if (Date.now() < expiry) {
        console.log(`[AI Cache] Hit for ${key}`);
        return data;
      }
      localStorage.removeItem(CACHE_KEY_PREFIX + key);
    }
  } catch (e) {
    // Ignore cache errors
  }
  return null;
};

const setInCache = (key: string, data: any, ttlSeconds = 3600) => {
  try {
    const payload = {
      data,
      expiry: Date.now() + (ttlSeconds * 1000)
    };
    localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(payload));
  } catch (e) {
    console.warn("Failed to set AI cache", e);
  }
};

// Helper hash function for cache keys
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
};

// --- API CLIENT ---

// Note: process.env.API_KEY is polyfilled in vite.config.ts to access the VITE_GEMINI_API_KEY
// This adheres to the strict requirement of the @google/genai SDK to use process.env.API_KEY.
const getClient = (): GoogleGenAI | null => {
  const apiKey = process.env.API_KEY;
  // Check for undefined string which might occur during vite string replacement if variable is missing
  if (!apiKey || apiKey === 'undefined') {
    console.warn("Gemini API Key is missing. Falling back to mock data.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCVFromTranscript = async (transcript: string): Promise<CVData> => {
  // 1. Data Protection: Mask PII before sending to AI or Cache
  // In a production environment, this would happen on a backend proxy service
  const safeTranscript = redactPII(transcript);

  // 2. Check Cache
  const cacheKey = `cv_${hashString(safeTranscript.substring(0, 100))}`; // Hash first 100 chars
  const cached = getFromCache<CVData>(cacheKey);
  if (cached) return cached;

  const ai = getClient();

  // Fallback to mock if AI client is not available (missing key)
  if (!ai) {
    console.info("Using Mock CV Data (No API Key configured)");
    return getMockCVData();
  }

  const prompt = `
    You are an expert HR assistant. Extract structured CV data from the following candidate transcript. 
    The transcript is a spoken professional introduction.
    
    IMPORTANT: The transcript might be in Italian, English, or another language. 
    Regardless of the input language, translate the content and extract the data into ENGLISH.
    
    Transcript: "${safeTranscript}"
    
    Return the data in strict JSON format matching the schema provided.
    Ensure "skills" is an array of strings.
    Ensure "experience" is an array of objects with role, company, and duration.
    If the transcript is very short or nonsensical, infer a polite placeholder summary stating that the audio was unclear, but do not invent fake experience.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            summary: { type: Type.STRING },
            skills: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  duration: { type: Type.STRING }
                }
              }
            },
            education: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      const parsedData = JSON.parse(response.text) as CVData;
      // 3. Set Cache
      setInCache(cacheKey, parsedData);
      return parsedData;
    }
    throw new Error("No response text generated from Gemini.");
  } catch (error) {
    console.error("Gemini API Error (generateCV):", error);
    // Graceful fallback to prevent UI crash
    return getMockCVData();
  }
};

export const analyzeJobMatch = async (
  candidateName: string, 
  jobTitle: string, 
  candidateSkills: string[], 
  jobSkills: string[]
): Promise<string> => {
  // 1. Check Cache
  const inputStr = `${candidateName}-${jobTitle}-${candidateSkills.join()}-${jobSkills.join()}`;
  const cacheKey = `match_${hashString(inputStr)}`;
  const cached = getFromCache<string>(cacheKey);
  if (cached) return cached;

  const ai = getClient();
  
  // Fallback if AI client unavailable
  if (!ai) return "AI Analysis unavailable (Demo Mode). Please configure API Key to enable live analysis.";

  const prompt = `
    Analyze the match between Candidate "${candidateName}" and Role "${jobTitle}".
    Candidate Skills: ${candidateSkills.join(', ')}.
    Job Required Skills: ${jobSkills.join(', ')}.
    
    Provide a brief, 2-sentence executive summary of why this candidate is or isn't a good fit.
    Focus on skill gaps and strengths.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text || "Analysis complete but no text returned.";
    // 2. Set Cache
    setInCache(cacheKey, text);
    return text;
  } catch (error) {
    console.error("Gemini Match Error:", error);
    return "Analysis unavailable due to service interruption.";
  }
};

export const chatWithAI = async (message: string, candidate: Candidate): Promise<string> => {
  const ai = getClient();
  if (!ai) return "I'm currently in demo mode. Connect your API key to chat with me!";

  const context = `
    You are 'Scabbio Bot', a helpful HR assistant for the candidate ${candidate.name}.
    Current Role: ${candidate.role}.
    Employability Score: ${candidate.employabilityScore}/100.
    Work Preference: ${candidate.workPreference}.
    Well-being Score: ${candidate.wellBeingScore}/10.

    User Message: "${message}"

    Answer briefly (max 50 words) and professionally. If asked about status, say their profile is under review.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });
    return response.text || "I didn't catch that.";
  } catch (e) {
    return "Service temporary unavailable.";
  }
};

// Helper for Mock Data fallback
const getMockCVData = (): CVData => ({
  fullName: "Giulia Bianchi (Demo)",
  summary: "Experienced Project Manager with a background in logistics and team leadership. (Note: This is generated mock data because the AI service was unavailable or the API key is missing).",
  skills: ["Project Management", "Agile", "Logistics", "Team Leadership", "Communication"],
  experience: [
    { role: "Senior Manager", company: "LogiTech Solutions", duration: "3 years" },
    { role: "Team Lead", company: "Transport Co.", duration: "2 years" }
  ],
  education: "MSc in Management Engineering"
});
