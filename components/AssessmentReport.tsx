import React from 'react';
import { Card } from './ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Share2, Download, Hexagon, Users, Lightbulb, Zap, Heart, MessageCircle, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useTranslation } from '../utils/i18n';
import { useCandidateContext } from '../context/CandidateContext';

const AssessmentReport: React.FC = () => {
  const { currentCandidate: candidate } = useCandidateContext();
  const { t } = useTranslation();
  
  if (!candidate || !candidate.assessmentProfile) return <div>No assessment data available.</div>;

  const { assessmentProfile: profile } = candidate;

  // Icon mapping for Talent Cloud
  const getIcon = (category: string) => {
    switch(category) {
      case 'INFLUENZARE': return <MessageCircle size={24} className="text-white" />;
      case 'COOPERARE': return <Users size={24} className="text-white" />;
      case 'RIFLETTERE': return <Lightbulb size={24} className="text-white" />;
      case 'AGIRE': return <Zap size={24} className="text-white" />;
      case 'SENTIRE': return <Heart size={24} className="text-white" />;
      default: return <Hexagon size={24} className="text-white" />;
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(candidate, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `gdpr_export_${candidate.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Sei sicuro? Questa azione è irreversibile e cancellerà tutti i tuoi dati personali dai nostri sistemi.")) {
        alert("Richiesta di cancellazione ricevuta. I tuoi dati verranno eliminati entro 30 giorni come da normativa GDPR.");
        window.location.reload();
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      
      {/* HEADER SECTION (Like Page 1 of PDF) */}
      <div className="relative bg-white rounded-[3rem] p-10 shadow-xl overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400 via-pink-500 to-blue-500 opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-orange-400 to-pink-600 shadow-xl">
             <img 
               src={candidate.avatar} 
               alt={candidate.name} 
               className="w-full h-full rounded-full object-cover border-4 border-white"
             />
          </div>
          <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-100 text-pink-600 font-bold text-xs uppercase tracking-widest mb-2">
                Swipe - Drive - Brain
             </div>
             <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">{candidate.name}</h1>
             <p className="text-xl text-slate-500 font-medium">{t('report.summary')} - {new Date().toLocaleDateString()}</p>
          </div>
          <div className="md:ml-auto flex gap-3">
             <Button variant="secondary" icon={Share2}>{t('report.share')}</Button>
             <Button variant="primary" icon={Download}>PDF</Button>
          </div>
        </div>
      </div>

      {/* PERSONALITY ANALYSIS (Page 2 PDF) */}
      <div className="grid lg:grid-cols-2 gap-8">
         <Card className="h-full">
            <div className="mb-6">
               <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{t('report.section1')}</span>
               <h2 className="text-3xl font-extrabold text-slate-800 mt-3">{t('report.personality')}</h2>
               <p className="text-pink-500 font-bold text-lg mt-1">{t('report.style')}: {profile.style}</p>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">
               {profile.summary}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-6">
               {profile.tags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-sm font-bold shadow-md shadow-pink-200">
                     {tag}
                  </span>
               ))}
            </div>
         </Card>

         <div className="space-y-6">
            <Card title={t('report.strengths')}>
               <div className="space-y-6">
                  <div>
                     <h4 className="font-bold text-slate-800 mb-2">{t('report.relations')}</h4>
                     <ul className="list-disc pl-5 space-y-1 text-slate-600">
                        {profile.strengths.relations.map((s,i) => <li key={i}>{s}</li>)}
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-800 mb-2">{t('report.work')}</h4>
                     <ul className="list-disc pl-5 space-y-1 text-slate-600">
                        {profile.strengths.work.map((s,i) => <li key={i}>{s}</li>)}
                     </ul>
                  </div>
               </div>
            </Card>

            <Card title={t('report.improvement')} className="bg-slate-50 border-none">
               <ul className="space-y-3">
                  {profile.areasOfImprovement.map((area, i) => (
                     <li key={i} className="flex gap-3 text-slate-600">
                        <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-xs">{i+1}</span>
                        {area}
                     </li>
                  ))}
               </ul>
            </Card>
         </div>
      </div>

      {/* TALENT CLOUD (Page 3 PDF) */}
      <Card>
         <div className="mb-10 text-center">
            <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{t('report.section2')}</span>
            <h2 className="text-4xl font-extrabold text-slate-800 mt-4">{t('report.talentCloud')}</h2>
            <p className="text-slate-400 mt-2">{t('report.predictive')}</p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {profile.talentCloud.map((item, idx) => (
               <div key={idx} className="flex flex-col items-center text-center group">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg mb-4 transition-transform group-hover:scale-110 duration-300"
                    style={{ backgroundColor: item.color }}
                  >
                     {getIcon(item.category)}
                  </div>
                  <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-1">{item.category}</h3>
                  <h4 className="font-bold text-slate-800 text-lg leading-tight mb-2">{item.title}</h4>
                  <div className="text-xs text-slate-500 space-y-1">
                     {item.items.map((sub, j) => (
                        <div key={j} className="border-t border-slate-100 pt-1 mt-1">{sub}</div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </Card>

      {/* MOTIVATIONS & MANAGEMENT (Page 10 PDF) */}
      <div className="grid lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2">
            <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">{t('report.section3')}</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-3 mb-8">{t('report.motivations')}</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
               {profile.motivations.managementStyle.map((style, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                     <div className="w-32 h-32 relative mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={[{ value: style.score }, { value: 100 - style.score }]}
                                 innerRadius={50}
                                 outerRadius={60}
                                 startAngle={90}
                                 endAngle={-270}
                                 dataKey="value"
                              >
                                 <Cell fill={style.color} />
                                 <Cell fill="#f1f5f9" />
                              </Pie>
                           </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-slate-800">
                           {style.score}%
                        </div>
                     </div>
                     <h3 className="font-bold text-slate-800">{style.label}</h3>
                     <p className="text-sm text-slate-500">{style.subtitle}</p>
                  </div>
               ))}
            </div>
         </Card>

         <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white shadow-2xl">
             <h3 className="font-bold text-lg mb-6">{t('report.keyFactors')}</h3>
             
             <div className="space-y-6">
                <div>
                   <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{t('report.motivators')}</h4>
                   <div className="flex flex-wrap gap-2">
                      {profile.motivations.top.map(m => (
                         <span key={m} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm border border-emerald-500/30">
                            + {m}
                         </span>
                      ))}
                   </div>
                </div>

                <div>
                   <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{t('report.demotivators')}</h4>
                   <div className="flex flex-wrap gap-2">
                      {profile.motivations.bottom.map(m => (
                         <span key={m} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm border border-red-500/30">
                            - {m}
                         </span>
                      ))}
                   </div>
                </div>
             </div>
         </div>
      </div>

      {/* GDPR & DATA CONTROL SECTION */}
      <Card className="bg-slate-50 border-slate-200">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
               <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={20} className="text-slate-600" />
                  <h3 className="font-bold text-slate-800 text-lg">{t('report.privacyTitle')}</h3>
               </div>
               <p className="text-slate-500 text-sm max-w-xl">
                  {t('report.privacyDesc')}
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
               <Button variant="secondary" icon={Download} onClick={handleExportData}>
                  {t('report.export')}
               </Button>
               <Button variant="danger" icon={Trash2} onClick={handleDeleteAccount}>
                  {t('report.delete')}
               </Button>
            </div>
         </div>
      </Card>
    </div>
  );
};

export default AssessmentReport;