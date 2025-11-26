
export type ViewState = 
  | 'ONBOARDING'
  | 'DASHBOARD' // Now maps to HR Analytics
  | 'REPORT'
  | 'VOICE_CV'
  | 'SKILL_MATRIX'
  | 'EMPLOYABILITY'
  | 'JOB_MATCHING';

export interface TalentCloudItem {
  category: 'INFLUENZARE' | 'COOPERARE' | 'RIFLETTERE' | 'AGIRE' | 'SENTIRE';
  title: string;
  items: string[];
  color: string;
}

export interface MotivationScore {
  label: string;
  score: number; // 0-100
  subtitle: string;
  color: string;
}

export interface AssessmentProfile {
  style: string;
  summary: string;
  strengths: {
    relations: string[];
    work: string[];
    emotions: string[];
  };
  tags: string[];
  areasOfImprovement: string[];
  motivations: {
    top: string[];
    bottom: string[];
    managementStyle: MotivationScore[];
    idealCulture: {
        collaboration: number;
        innovation: number;
        competition: number;
        organization: number;
    }
  };
  talentCloud: TalentCloudItem[];
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: Record<string, number>; // 0-100
  employabilityScore: number;
  lastActive: string;
  assessmentProfile?: AssessmentProfile;
  aiConsent?: boolean;
  source: 'AI_VOICE' | 'MANUAL_UPLOAD';
  // New HR Tech Trends 2025 Fields
  workPreference: 'REMOTE' | 'HYBRID' | 'ONSITE';
  wellBeingScore?: number; // 0-10 (High means good well-being, Low means burnout risk)
}

export interface JobOffer {
  id: string;
  title: string;
  requiredSkills: Record<string, number>;
  department: string;
  location: string;
}

export interface GapAnalysis {
  skill: string;
  candidateScore: number;
  targetScore: number;
  gap: number;
  severity: 'High' | 'Medium' | 'Low';
}

export interface CVData {
  fullName: string;
  summary: string;
  skills: string[];
  experience: Array<{
    role: string;
    company: string;
    duration: string;
  }>;
  education: string;
}

export interface MatchingResult {
  candidateId: string;
  affinityScore: number;
  matchDetails: {
    skillMatch: number;
    experienceMatch: number;
    locationMatch: number;
    compensationMatch: number;
    industryMatch: number;
  };
  humanReviewed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}
