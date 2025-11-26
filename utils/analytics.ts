import { Candidate, JobOffer, GapAnalysis } from '../types';

export interface SkillChartData {
  subject: string;
  candidateScore: number;
  requiredScore: number;
  fullMark: number;
}

export const analyzeSkills = (candidate: Candidate, job: JobOffer) => {
  // Combine all unique skills from both candidate and job
  const allSkills = Array.from(new Set([
    ...Object.keys(candidate.skills),
    ...Object.keys(job.requiredSkills)
  ]));

  const chartData: SkillChartData[] = allSkills.map(skill => ({
    subject: skill,
    candidateScore: candidate.skills[skill] || 0,
    requiredScore: job.requiredSkills[skill] || 0,
    fullMark: 100,
  }));

  const gaps: GapAnalysis[] = allSkills.map(skill => {
    const candidateScore = candidate.skills[skill] || 0;
    const targetScore = job.requiredSkills[skill] || 0;
    const gap = targetScore - candidateScore;

    // Severity logic based on gap magnitude
    let severity: 'High' | 'Medium' | 'Low' = 'Low';
    if (gap > 30) severity = 'High';
    else if (gap > 15) severity = 'Medium';

    return {
      skill,
      candidateScore,
      targetScore,
      gap: gap > 0 ? gap : 0, 
      severity
    };
  });

  // Filter only actual gaps (where target > candidate) for the alert list
  const criticalGaps = gaps
    .filter(g => g.targetScore > g.candidateScore)
    .sort((a, b) => b.gap - a.gap);

  return { chartData, allGaps: gaps, criticalGaps };
};

// --- NEW DETERMINISTIC MATCHING ENGINE ---

interface MatchAnalysis {
  overallScore: number;
  details: {
    skillMatch: number;
    experienceMatch: number; // Proxy via Employability
    locationMatch: number;   // Simulated/Mocked for now
    roleFit: number;
  };
  suggestions: string[];
}

export const calculateMatchScore = (candidate: Candidate, job: JobOffer): MatchAnalysis => {
  // 1. SKILL MATCH (60% Weight)
  // Calculate weighted overlap of skills
  const jobSkillKeys = Object.keys(job.requiredSkills);
  let totalSkillPotential = 0;
  let earnedSkillPoints = 0;

  jobSkillKeys.forEach(skill => {
    const reqLevel = job.requiredSkills[skill];
    const candLevel = candidate.skills[skill] || 0;
    
    totalSkillPotential += reqLevel;
    // Cap earned points at the required level (over-qualification doesn't add infinite points here)
    earnedSkillPoints += Math.min(candLevel, reqLevel);
  });

  const skillMatch = jobSkillKeys.length > 0 
    ? Math.round((earnedSkillPoints / totalSkillPotential) * 100) 
    : 0;

  // 2. ROLE FIT (20% Weight)
  // Simple semantic check (contains words)
  const jobTitleWords = job.title.toLowerCase().split(' ');
  const candRoleWords = candidate.role.toLowerCase().split(' ');
  const intersection = jobTitleWords.filter(w => candRoleWords.includes(w));
  const roleFit = Math.round((intersection.length / jobTitleWords.length) * 100) || 50; // Base 50 if no direct word match

  // 3. EXPERIENCE / EMPLOYABILITY (20% Weight)
  // We use the employability score as a proxy for general quality/seniority
  const experienceMatch = candidate.employabilityScore;

  // 4. WEIGHTED TOTAL
  const overallScore = Math.round(
    (skillMatch * 0.6) + 
    (roleFit * 0.2) + 
    (experienceMatch * 0.2)
  );

  // 5. GENERATE SUGGESTIONS
  const suggestions: string[] = [];
  
  // Skill Gaps
  const missingSkills = jobSkillKeys.filter(s => (candidate.skills[s] || 0) < job.requiredSkills[s]);
  if (missingSkills.length > 0) {
    suggestions.push(`Upskill required: ${missingSkills.slice(0, 2).join(', ')}`);
  }
  
  // Role Transition
  if (roleFit < 80) {
    suggestions.push(`Role transition path needed from ${candidate.role} to ${job.title}`);
  }

  // General Quality
  if (experienceMatch < 70) {
    suggestions.push("Improve general employability score through more activity.");
  }

  return {
    overallScore,
    details: {
      skillMatch,
      roleFit,
      experienceMatch,
      locationMatch: 100 // Mocked for this demo as we assume local pool
    },
    suggestions
  };
};