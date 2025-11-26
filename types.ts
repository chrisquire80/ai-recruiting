export type ViewState = 
  | 'ONBOARDING'
  | 'DASHBOARD'
  | 'REPORT' // New view for the detailed PDF report
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
  style: string; // e.g., "Collaboratore"
  summary: string;
  strengths: {
    relations: string[];
    work: string[];
    emotions: string[];
  };
  tags: string[]; // e.g., ["#Umile", "#Empatico"]
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
  assessmentProfile?: AssessmentProfile; // Optional detailed profile
}

export interface JobOffer {
  id: string;
  title: string;
  requiredSkills: Record<string, number>; // 0-100 (level required)
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
  affinityScore: number; // 0-100
  matchDetails: {
    skillMatch: number;
    experienceMatch: number;
    locationMatch: number;
    compensationMatch: number;
    industryMatch: number;
  };
}