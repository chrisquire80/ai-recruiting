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