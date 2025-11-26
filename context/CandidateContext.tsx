import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Candidate, JobOffer } from '../types';
import { RICCARDO_PINNA, MOCK_JOB, CANDIDATES_POOL } from '../mockData';

interface CandidateContextType {
  currentCandidate: Candidate;
  jobOffer: JobOffer;
  candidatePool: Candidate[];
  setCurrentCandidate: (candidate: Candidate) => void;
  updateCurrentCandidate: (updates: Partial<Candidate>) => void;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export const CandidateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with Mock Data
  const [currentCandidate, setCurrentCandidate] = useState<Candidate>(RICCARDO_PINNA);
  const [jobOffer] = useState<JobOffer>(MOCK_JOB);
  const [candidatePool] = useState<Candidate[]>(CANDIDATES_POOL);

  const updateCurrentCandidate = (updates: Partial<Candidate>) => {
    setCurrentCandidate(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <CandidateContext.Provider value={{ 
      currentCandidate, 
      jobOffer, 
      candidatePool, 
      setCurrentCandidate, 
      updateCurrentCandidate 
    }}>
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidateContext = () => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidateContext must be used within a CandidateProvider');
  }
  return context;
};