import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { TrendingUp, Award, Briefcase, Users, Calendar, Settings, RotateCcw, Save, Download } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useCandidateContext } from '../context/CandidateContext';
import { 
  ScoringFactor, 
  loadFactors, 
  saveFactors, 
  resetFactors, 
  calculateScore, 
  getGrade, 
  generateReport 
} from '../utils/scoring';

const Employability: React.FC = () => {
  const { currentCandidate: candidate } = useCandidateContext();
  const [factors, setFactors] = useState<ScoringFactor[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Load initial factors (from localStorage or defaults)
  useEffect(() => {
    setFactors(loadFactors());
  }, []);

  const handleWeightChange = (id: string, newWeight: number) => {
    setFactors(prev => prev.map(f => 
      f.id === id ? { ...f, weight: newWeight } : f
    ));
  };

  const handleSave = () => {
    saveFactors(factors);
    setIsEditing(false);
  };

  const handleReset = () => {
    setFactors(resetFactors());
  };

  const handleExport = () => {
    const report = generateReport(candidate, factors, score);
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Employability_Report_${candidate.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const score = calculateScore(factors);
  const { grade, label, bg, color } = getGrade(score);

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-fade-in pb-12">
      {/* Score Dashboard */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="flex flex-col items-center justify-center text-center relative overflow-hidden p-0">
          <div className={`absolute top-0 w-full h-2 ${score >= 60 ? 'bg-teal-500' : 'bg-red-500'}`}></div>
          <div className="p-8 w-full flex flex-col items-center">
            <div className="mb-6 relative">
               <div className="w-40 h-40 rounded-full border-8 border-slate-50 flex items-center justify-center shadow-inner bg-white z-10 relative">
                  <div>
                      <span className="block text-5xl font-extrabold text-slate-800">{score}</span>
                      <span className="text-xs text-slate-400 uppercase tracking-widest">Score</span>
                  </div>
               </div>
               <div className={`absolute inset-0 rounded-full border-4 opacity-20 ${score >= 80 ? 'border-teal-500' : 'border-amber-500'}`} style={{ transform: 'scale(1.1)' }}></div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">{candidate.name}</h3>
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${bg} ${color}`}>
                Grade {grade}: {label}
            </div>
          </div>
        </Card>

        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
           <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-teal-400" />
              <h4 className="font-bold">Optimization Tips</h4>
           </div>
           <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-2">
                 <span className="text-teal-500">•</span>
                 <span>Increase interview frequency to boost "Activity" score.</span>
              </li>
              <li className="flex gap-2">
                 <span className="text-teal-500">•</span>
                 <span>Refresh technical skills to match rising "Market Demand".</span>
              </li>
           </ul>
        </div>
      </div>

      {/* Breakdown Chart & Details */}
      <Card 
        title={isEditing ? "Configure Algorithm Weights" : "Scoring Factors Breakdown"} 
        action={
          <div className="flex gap-2">
             {isEditing ? (
               <>
                 <Button variant="ghost" onClick={handleReset} title="Reset to Defaults" className="px-3">
                   <RotateCcw size={16} />
                 </Button>
                 <Button variant="primary" onClick={handleSave} className="h-8 px-3 text-xs">
                   <Save size={14} className="mr-1" /> Save
                 </Button>
               </>
             ) : (
               <>
                 <button onClick={handleExport} className="text-slate-400 hover:text-teal-600 p-1.5 rounded transition-colors" title="Export Report">
                    <Download size={18} />
                 </button>
                 <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-teal-600 p-1.5 rounded transition-colors" title="Configure Weights">
                    <Settings size={18} />
                 </button>
               </>
             )}
          </div>
        } 
        className="lg:col-span-2"
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Chart - Hidden in Edit Mode on mobile to save space, or scaled down */}
            <div className={`w-full md:w-1/2 h-64 ${isEditing ? 'hidden md:block opacity-50' : ''} transition-opacity`}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={factors}
                            dataKey="weight"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            stroke="none"
                        >
                            {factors.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <RechartsTooltip />
                    </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-xs text-slate-400 mt-2">Current Weight Distribution</p>
            </div>

            {/* Factors List / Editors */}
            <div className="w-full md:w-1/2 space-y-5 max-h-[400px] overflow-y-auto pr-2">
                {factors.map((factor) => (
                    <div key={factor.id} className="group">
                        <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-slate-600 font-medium">{factor.name}</span>
                            {isEditing ? (
                               <span className="text-teal-600 font-bold text-xs bg-teal-50 px-2 py-0.5 rounded">Weight: {factor.weight}</span>
                            ) : (
                               <span className="text-slate-900 font-bold">{factor.score}/100</span>
                            )}
                        </div>
                        
                        {isEditing ? (
                          <div className="flex items-center gap-3">
                             <input 
                               type="range" 
                               min="0" 
                               max="100" 
                               step="5"
                               value={factor.weight} 
                               onChange={(e) => handleWeightChange(factor.id, parseInt(e.target.value))}
                               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                             />
                          </div>
                        ) : (
                          <div className="w-full bg-slate-100 rounded-full h-2">
                              <div 
                                  className="h-2 rounded-full transition-all duration-1000 ease-out" 
                                  style={{ width: `${factor.score}%`, backgroundColor: factor.color }}
                              ></div>
                          </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="text-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex justify-center text-slate-400 mb-2"><Briefcase size={20} /></div>
                <div className="text-xl font-bold text-slate-800">12</div>
                <div className="text-xs text-slate-500">Months Active</div>
            </div>
            <div className="text-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex justify-center text-slate-400 mb-2"><Users size={20} /></div>
                <div className="text-xl font-bold text-slate-800">5</div>
                <div className="text-xs text-slate-500">Interviews</div>
            </div>
            <div className="text-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex justify-center text-slate-400 mb-2"><Award size={20} /></div>
                <div className="text-xl font-bold text-slate-800">Top 10%</div>
                <div className="text-xs text-slate-500">Skill Rank</div>
            </div>
            <div className="text-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex justify-center text-slate-400 mb-2"><Calendar size={20} /></div>
                <div className="text-xl font-bold text-slate-800">2d ago</div>
                <div className="text-xs text-slate-500">Last Active</div>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default Employability;