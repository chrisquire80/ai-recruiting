import React, { useState } from 'react';
import { MatchingResult, Candidate, JobOffer } from '../types';
import { analyzeJobMatch } from '../services/geminiService';
import { Sparkles, MapPin, Briefcase, Send, Star, User, Wand2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface JobMatchingProps {
  candidates: Candidate[];
  job: JobOffer;
}

// Internal component to handle avatar loading states and errors
const CandidateAvatar: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
        <User size={20} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
};

const JobMatching: React.FC<JobMatchingProps> = ({ candidates, job }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock calculation of matches based on SCABBIO logic
  const matches: MatchingResult[] = candidates.map(c => {
    const skillScore = Math.floor(Math.random() * 30) + 70; 
    const overall = Math.floor(Math.random() * 20) + 75;
    return {
      candidateId: c.id,
      affinityScore: overall,
      matchDetails: {
        skillMatch: skillScore,
        experienceMatch: 80,
        locationMatch: 90,
        compensationMatch: 70,
        industryMatch: 85
      }
    };
  }).sort((a, b) => b.affinityScore - a.affinityScore);

  const handleSelectCandidate = (candidateId: string) => {
    if (selectedCandidate === candidateId) return;
    setSelectedCandidate(candidateId);
    setAiAnalysis(null); // Reset analysis when changing candidate
  };

  const runAiAnalysis = async () => {
    if (!selectedCandidate || isAnalyzing) return;
    
    setIsAnalyzing(true);
    const c = candidates.find(cand => cand.id === selectedCandidate);
    
    if (c) {
      const analysis = await analyzeJobMatch(
        c.name, 
        job.title, 
        Object.keys(c.skills), 
        Object.keys(job.requiredSkills)
      );
      setAiAnalysis(analysis);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-140px)] animate-fade-in">
      {/* List of Matches */}
      <Card className="lg:col-span-1 p-0 flex flex-col h-full overflow-hidden" title={`Candidates for: ${job.title}`} action={<p className="text-xs text-slate-500">{matches.length} matches</p>}>
        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {matches.map((m) => {
            const candidate = candidates.find(c => c.id === m.candidateId)!;
            const isSelected = selectedCandidate === m.candidateId;
            return (
              <div 
                key={m.candidateId}
                onClick={() => handleSelectCandidate(m.candidateId)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${isSelected ? 'bg-teal-50 border-teal-200 shadow-sm ring-1 ring-teal-200' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
              >
                <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                         <CandidateAvatar src={candidate.avatar} alt={candidate.name} />
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 text-sm">{candidate.name}</h4>
                         <p className="text-xs text-slate-500">{candidate.role}</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className={`text-lg font-bold ${m.affinityScore > 85 ? 'text-teal-600' : 'text-amber-600'}`}>
                        {m.affinityScore}%
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide">Affinity</span>
                   </div>
                </div>
                
                {/* Mini bars for breakdown */}
                <div className="flex gap-1 mt-2">
                    <div className="h-1 bg-slate-200 flex-1 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400" style={{ width: `${m.matchDetails.skillMatch}%` }} title="Skill"></div>
                    </div>
                    <div className="h-1 bg-slate-200 flex-1 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${m.matchDetails.locationMatch}%` }} title="Location"></div>
                    </div>
                    <div className="h-1 bg-slate-200 flex-1 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${m.matchDetails.experienceMatch}%` }} title="Exp"></div>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Detail View */}
      <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2">
        {selectedCandidate ? (
          <>
             <Card>
                {(() => {
                   const c = candidates.find(cand => cand.id === selectedCandidate)!;
                   const m = matches.find(match => match.candidateId === selectedCandidate)!;
                   return (
                     <div className="animate-fade-in-up">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{c.name}</h2>
                                <div className="flex items-center gap-4 text-slate-500 mt-2 text-sm">
                                    <span className="flex items-center gap-1"><Briefcase size={14}/> {c.role}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14}/> Milan, Italy</span>
                                </div>
                            </div>
                            <Button icon={Send} variant="primary">Contact Candidate</Button>
                        </div>

                        {/* Affinity Breakdown */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                            {[
                                { l: 'Skills', v: m.matchDetails.skillMatch, c: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                                { l: 'Experience', v: m.matchDetails.experienceMatch, c: 'bg-blue-50 text-blue-700 border-blue-100' },
                                { l: 'Location', v: m.matchDetails.locationMatch, c: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                                { l: 'Salary', v: m.matchDetails.compensationMatch, c: 'bg-amber-50 text-amber-700 border-amber-100' },
                                { l: 'Industry', v: m.matchDetails.industryMatch, c: 'bg-purple-50 text-purple-700 border-purple-100' },
                            ].map((item, i) => (
                                <div key={i} className={`p-4 rounded-xl text-center border ${item.c}`}>
                                    <div className="text-xl font-bold">{item.v}%</div>
                                    <div className="text-[10px] uppercase font-bold opacity-70">{item.l}</div>
                                </div>
                            ))}
                        </div>

                        {/* AI Analysis Box */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4 relative z-10">
                              <div className="flex items-center gap-2 text-indigo-800 font-bold">
                                <Sparkles size={18} />
                                <span>AI Matching Insight</span>
                              </div>
                              <Button 
                                onClick={runAiAnalysis}
                                disabled={isAnalyzing}
                                isLoading={isAnalyzing}
                                icon={Wand2}
                                variant={aiAnalysis ? "secondary" : "primary"}
                                className={aiAnalysis ? "bg-white/80 hover:bg-white border-indigo-200 text-indigo-700" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 shadow-lg border-transparent"}
                              >
                                {isAnalyzing ? "Analyzing Fit..." : aiAnalysis ? "Regenerate Analysis" : "Analyze Match with AI"}
                              </Button>
                            </div>

                            {isAnalyzing ? (
                                <div className="animate-pulse space-y-2 max-w-lg">
                                    <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
                                </div>
                            ) : (
                                <p className="text-slate-700 text-sm leading-relaxed relative z-10 min-h-[60px]">
                                    {aiAnalysis || "Click the button above to generate a detailed AI analysis of the candidate's fit for this role."}
                                </p>
                            )}
                            <Sparkles className="absolute -bottom-4 -right-4 text-indigo-100 opacity-50" size={120} />
                        </div>
                     </div>
                   );
                })()}
             </Card>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
             <Star size={48} className="mb-4 opacity-50" />
             <p>Select a candidate to view detailed affinity analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatching;