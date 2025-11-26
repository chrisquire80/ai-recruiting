import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CVData } from '../types';

// Initialize the client.
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
    
    Transcript: "${transcript}"
    
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
      return JSON.parse(response.text) as CVData;
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
    
    return response.text || "Analysis complete but no text returned.";
  } catch (error) {
    console.error("Gemini Match Error:", error);
    return "Analysis unavailable due to service interruption.";
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