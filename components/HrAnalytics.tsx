
import React from 'react';
import { Card } from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useCandidateContext } from '../context/CandidateContext';
import { Users, Briefcase, Globe, TrendingUp, AlertCircle } from 'lucide-react';

const HrAnalytics: React.FC = () => {
  const { candidatePool } = useCandidateContext();

  // 1. Calculate Aggregated Metrics
  const totalCandidates = candidatePool.length;
  const avgEmployability = Math.round(candidatePool.reduce((acc, c) => acc + c.employabilityScore, 0) / totalCandidates);
  const riskCandidates = candidatePool.filter(c => (c.wellBeingScore || 10) < 7).length;

  // 2. Prepare Chart Data - Work Preference
  const prefData = [
    { name: 'Remote', value: candidatePool.filter(c => c.workPreference === 'REMOTE').length, color: '#38bdf8' },
    { name: 'Hybrid', value: candidatePool.filter(c => c.workPreference === 'HYBRID').length, color: '#ec4899' },
    { name: 'Onsite', value: candidatePool.filter(c => c.workPreference === 'ONSITE').length, color: '#f97316' },
  ].filter(d => d.value > 0);

  // 3. Prepare Chart Data - Skill Distribution (Mock aggregation)
  const skillCounts: Record<string, number> = {};
  candidatePool.forEach(c => {
    Object.keys(c.skills).forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });
  const skillData = Object.entries(skillCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-extrabold text-slate-800">HR Executive Dashboard</h1>
            <p className="text-slate-500 mt-1">Real-time insights into talent pool, preferences, and well-being.</p>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
             <div className="flex justify-between items-start">
                 <div className="p-2 bg-pink-100 text-pink-600 rounded-xl"><Users size={20} /></div>
                 <span className="text-xs font-bold text-slate-400 uppercase">Total Candidates</span>
             </div>
             <div className="text-3xl font-extrabold text-slate-800">{totalCandidates}</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
             <div className="flex justify-between items-start">
                 <div className="p-2 bg-teal-100 text-teal-600 rounded-xl"><TrendingUp size={20} /></div>
                 <span className="text-xs font-bold text-slate-400 uppercase">Avg. Employability</span>
             </div>
             <div className="text-3xl font-extrabold text-slate-800">{avgEmployability}/100</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
             <div className="flex justify-between items-start">
                 <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Globe size={20} /></div>
                 <span className="text-xs font-bold text-slate-400 uppercase">Remote/Hybrid</span>
             </div>
             <div className="text-3xl font-extrabold text-slate-800">
                {Math.round(((candidatePool.filter(c => c.workPreference !== 'ONSITE').length) / totalCandidates) * 100)}%
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
             <div className="flex justify-between items-start">
                 <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><AlertCircle size={20} /></div>
                 <span className="text-xs font-bold text-slate-400 uppercase">Burnout Risk</span>
             </div>
             <div className="text-3xl font-extrabold text-slate-800">{riskCandidates}</div>
          </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
         {/* Work Preference Chart */}
         <Card title="Hybrid Work Preferences">
            <div className="h-64 flex items-center">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={prefData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {prefData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="space-y-2">
                  {prefData.map((entry, i) => (
                     <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="font-bold text-slate-700">{entry.name}</span>
                        <span className="text-slate-400">({entry.value})</span>
                     </div>
                  ))}
               </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
               Monitoring hybrid work adoption helps optimize office space and candidate satisfaction.
            </p>
         </Card>

         {/* Organizational Skills */}
         <Card title="Organizational Skill Matrix">
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillData} layout="vertical" margin={{ left: 40 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: '#64748b' }} />
                     <Tooltip cursor={{fill: '#f8fafc'}} />
                     <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
               Top skills currently available in your talent pool.
            </p>
         </Card>
      </div>
    </div>
  );
};

export default HrAnalytics;
