import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Candidate, JobOffer } from '../types';
import { AlertTriangle, Check, Info, List, BarChart2 } from 'lucide-react';
import { Card } from './ui/Card';
import { analyzeSkills } from '../utils/analytics';

interface SkillMatrixProps {
  candidate: Candidate;
  job: JobOffer;
}

const SkillMatrix: React.FC<SkillMatrixProps> = ({ candidate, job }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  
  const { chartData, criticalGaps } = useMemo(() => analyzeSkills(candidate, job), [candidate, job]);

  // Custom Tooltip for Radar Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          <div className="flex flex-col gap-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                 <span className="text-slate-500">{entry.name}:</span>
                 <span className="font-mono font-bold text-slate-700">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Visualization Section */}
        <Card 
          title="Skill Assessment Matrix" 
          action={
            <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
               <button 
                 onClick={() => setViewMode('chart')}
                 className={`p-1.5 rounded-md transition-all ${viewMode === 'chart' ? 'bg-white shadow text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
                 title="Radar Chart View"
               >
                 <BarChart2 size={16} />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
                 title="List View (Mobile Friendly)"
               >
                 <List size={16} />
               </button>
            </div>
          }
        >
          <div className="h-[400px] w-full">
            {viewMode === 'chart' ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={candidate.name}
                    dataKey="candidateScore"
                    stroke="#0d9488"
                    strokeWidth={3}
                    fill="#14b8a6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Required Level"
                    dataKey="requiredScore"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    fill="#cbd5e1"
                    fillOpacity={0.1}
                  />
                  <Legend iconType="circle" />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full overflow-y-auto pr-2 space-y-4">
                 {chartData.map((item, idx) => (
                   <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm font-medium">
                         <span className="text-slate-700">{item.subject}</span>
                         <span className={item.candidateScore >= item.requiredScore ? 'text-teal-600' : 'text-amber-600'}>
                            {item.candidateScore} <span className="text-slate-400 font-normal">/ {item.requiredScore}</span>
                         </span>
                      </div>
                      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                         {/* Target Marker */}
                         <div 
                           className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" 
                           style={{ left: `${item.requiredScore}%` }}
                           title={`Target: ${item.requiredScore}`}
                         ></div>
                         {/* Candidate Bar */}
                         <div 
                            className={`h-full rounded-full transition-all duration-500 ${item.candidateScore >= item.requiredScore ? 'bg-teal-500' : 'bg-amber-400'}`}
                            style={{ width: `${item.candidateScore}%` }}
                         ></div>
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </Card>

        {/* Gap Analysis Section */}
        <Card title="Gap Analysis & Actions" className="h-full flex flex-col">
             {criticalGaps.length === 0 ? (
                 <div className="flex flex-col items-center justify-center flex-grow text-teal-600 py-12">
                     <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                        <Check size={32} />
                     </div>
                     <p className="font-bold text-lg">Perfect Match!</p>
                     <p className="text-slate-500 text-sm">No critical skill gaps detected for this role.</p>
                 </div>
             ) : (
                 <div className="space-y-4">
                     {criticalGaps.map((g, idx) => (
                         <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:border-slate-200">
                             <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                                 g.severity === 'High' ? 'bg-red-100 text-red-600' :
                                 g.severity === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                 'bg-blue-100 text-blue-600'
                             }`}>
                                 <AlertTriangle size={16} />
                             </div>
                             <div className="flex-grow">
                                 <div className="flex justify-between items-center mb-1">
                                     <h4 className="font-bold text-slate-700">{g.skill}</h4>
                                     <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                                         g.severity === 'High' ? 'bg-red-50 text-red-700 border-red-100' :
                                         g.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                         'bg-blue-50 text-blue-700 border-blue-100'
                                     }`}>
                                         {g.severity} Gap
                                     </span>
                                 </div>
                                 <p className="text-xs text-slate-500 mb-2">
                                     Candidate score is <span className="font-bold">{g.gap} points</span> below target.
                                 </p>
                                 <div className="w-full bg-slate-200 rounded-full h-1.5">
                                     <div className="bg-slate-400 h-1.5 rounded-l-full" style={{ width: `${g.candidateScore}%` }}></div>
                                     {/* This represents the gap visually, but strictly speaking it's just the candidate score bar */}
                                 </div>
                             </div>
                         </div>
                     ))}
                     
                     <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
                         <h4 className="text-sm font-bold text-teal-800 mb-2 flex items-center gap-2">
                           <Info size={16} /> Recommended Actions
                         </h4>
                         <ul className="text-sm text-teal-700 space-y-2 list-disc pl-4 marker:text-teal-400">
                             {criticalGaps.some(g => g.severity === 'High') && (
                               <li>Schedule a technical deep-dive interview focusing on <strong>{criticalGaps.filter(g => g.severity === 'High').map(g => g.skill).join(', ')}</strong>.</li>
                             )}
                             <li>Suggest assigning an upskilling course for <strong>{criticalGaps[0].skill}</strong> via the LMS platform.</li>
                         </ul>
                     </div>
                 </div>
             )}
        </Card>
      </div>

      {/* Detailed Comparison Table (Visible on all screens for deep dive) */}
      <Card title="Detailed Skill Comparison">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                  <tr>
                     <th className="px-4 py-3 rounded-tl-lg">Skill</th>
                     <th className="px-4 py-3">Candidate Level</th>
                     <th className="px-4 py-3">Required Level</th>
                     <th className="px-4 py-3 rounded-tr-lg">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {chartData.map((item, idx) => (
                     <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800">{item.subject}</td>
                        <td className="px-4 py-3">
                           <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                 <div className="bg-teal-500 h-full" style={{ width: `${item.candidateScore}%` }}></div>
                              </div>
                              <span className="text-xs text-slate-500">{item.candidateScore}</span>
                           </div>
                        </td>
                        <td className="px-4 py-3">
                           <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                 <div className="bg-slate-400 h-full" style={{ width: `${item.requiredScore}%` }}></div>
                              </div>
                              <span className="text-xs text-slate-500">{item.requiredScore}</span>
                           </div>
                        </td>
                        <td className="px-4 py-3">
                           {item.candidateScore >= item.requiredScore ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                 <Check size={10} /> Qualified
                              </span>
                           ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                 Gap: -{item.requiredScore - item.candidateScore}
                              </span>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};

export default SkillMatrix;