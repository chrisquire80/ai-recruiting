import { Candidate } from '../types';

export interface ScoringFactor {
  id: string;
  name: string;
  weight: number; // 0-100 relative importance
  score: number;  // 0-100 actual performance
  color: string;
}

export const DEFAULT_FACTORS: ScoringFactor[] = [
  { id: 'recent_placements', name: 'Recent Placements', weight: 30, score: 85, color: '#0d9488' },
  { id: 'interviews', name: 'Interviews Held', weight: 15, score: 90, color: '#14b8a6' },
  { id: 'market_demand', name: 'Market Demand', weight: 10, score: 70, color: '#2dd4bf' },
  { id: 'search_visibility', name: 'Search Visibility', weight: 10, score: 60, color: '#5eead4' },
  { id: 'client_feedback', name: 'Client Feedback', weight: 8, score: 95, color: '#99f6e4' },
  { id: 'shortlist', name: 'Shortlist Presence', weight: 5, score: 80, color: '#ccfbf1' },
];

const STORAGE_KEY = 'scabbio_scoring_weights';

export const loadFactors = (): ScoringFactor[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedWeights = JSON.parse(stored) as Record<string, number>;
      // Merge stored weights with default structure to ensure integrity
      return DEFAULT_FACTORS.map(f => ({
        ...f,
        weight: parsedWeights[f.id] !== undefined ? parsedWeights[f.id] : f.weight
      }));
    }
  } catch (e) {
    console.error("Failed to load scoring weights", e);
  }
  return DEFAULT_FACTORS;
};

export const saveFactors = (factors: ScoringFactor[]) => {
  try {
    const weights = factors.reduce((acc, f) => ({ ...acc, [f.id]: f.weight }), {});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weights));
  } catch (e) {
    console.error("Failed to save scoring weights", e);
  }
};

export const resetFactors = (): ScoringFactor[] => {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_FACTORS;
};

export const calculateScore = (factors: ScoringFactor[]) => {
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  factors.forEach(f => {
    totalWeightedScore += f.score * f.weight;
    totalWeight += f.weight;
  });
  
  // Guard against division by zero
  if (totalWeight === 0) return 0;
  
  return Math.round(totalWeightedScore / totalWeight);
};

export const getGrade = (score: number) => {
  if (score >= 90) return { grade: 'A', label: 'Top Talent', color: 'text-emerald-600', bg: 'bg-emerald-100' };
  if (score >= 80) return { grade: 'B', label: 'Highly Employable', color: 'text-teal-600', bg: 'bg-teal-100' };
  if (score >= 70) return { grade: 'C', label: 'Employable', color: 'text-blue-600', bg: 'bg-blue-100' };
  if (score >= 60) return { grade: 'D', label: 'Needs Improvement', color: 'text-amber-600', bg: 'bg-amber-100' };
  return { grade: 'E', label: 'At Risk', color: 'text-red-600', bg: 'bg-red-100' };
};

export const generateReport = (candidate: Candidate, factors: ScoringFactor[], finalScore: number) => {
  const { grade, label } = getGrade(finalScore);
  return {
    candidateId: candidate.id,
    candidateName: candidate.name,
    generatedAt: new Date().toISOString(),
    finalScore,
    grade,
    label,
    breakdown: factors.map(f => ({
      factor: f.name,
      weight: f.weight,
      score: f.score,
      contribution: (f.score * f.weight) // Raw contribution
    }))
  };
};