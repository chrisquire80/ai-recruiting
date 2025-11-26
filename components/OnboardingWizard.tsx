import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Check, User, Briefcase, Heart } from 'lucide-react';
import VoiceCV from './VoiceCV';

interface Props {
  onComplete: () => void;
}

const OnboardingWizard: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: 'Christian',
    lastName: 'Robecchi',
    role: 'Product Designer',
    pronoun: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleNext = () => setStep(step + 1);

  const selectRole = (role: string) => {
    setFormData({ ...formData, role });
    setShowSuggestions(false);
  };

  // Step 1: Privacy & Terms (Screenshot 1)
  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <Card className="text-center pb-12">
           <div className="flex justify-center mb-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-100"></div>
           </div>
           
           <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Crea il tuo account<span className="text-pink-500">.</span></h1>
           
           <div className="space-y-4 text-left max-w-sm mx-auto mb-10">
              <label className="flex items-start gap-3 cursor-pointer group">
                 <div className="w-6 h-6 rounded bg-pink-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-pink-600 transition-colors">
                    <Check size={16} />
                 </div>
                 <span className="text-slate-600 text-sm leading-tight">
                    Accetto <a href="#" className="text-sky-600 font-bold hover:underline">termini e condizioni</a> e la <a href="#" className="text-sky-600 font-bold hover:underline">Normativa sulla privacy</a>.*
                 </span>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                 <div className="w-6 h-6 rounded bg-pink-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-pink-600 transition-colors">
                    <Check size={16} />
                 </div>
                 <span className="text-slate-600 text-sm leading-tight">
                    Voglio ricevere consigli su come sviluppare il mio potenziale e ottenere avanzamenti di carriera.
                 </span>
              </label>
           </div>
           
           <div className="flex justify-between items-center max-w-sm mx-auto">
              <button className="font-bold text-slate-500 hover:text-slate-800 underline">Indietro</button>
              <Button onClick={handleNext} className="shadow-pink-500/30">Avanti</Button>
           </div>
        </Card>
        <p className="text-center text-xs text-slate-400 mt-6 max-w-md mx-auto leading-relaxed">
           AssessFirst tratta i tuoi dati personali per offrire i suoi servizi. Scopri di più nella nostra Normativa sulla privacy.
        </p>
      </div>
    );
  }

  // Step 2: Personal Info (Screenshot 2)
  if (step === 2) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <Card className="text-center pb-12">
           <div className="flex justify-center mb-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-100"></div>
           </div>

           <h1 className="text-3xl font-extrabold text-slate-800 mb-8">Parlaci di te<span className="text-pink-500">.</span></h1>

           <div className="space-y-5 text-left max-w-sm mx-auto mb-10">
              <div>
                 <label className="block text-slate-400 text-sm font-bold mb-1">Nome*</label>
                 <input 
                   type="text" 
                   value={formData.firstName}
                   onChange={e => setFormData({...formData, firstName: e.target.value})}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-slate-800 font-medium"
                 />
              </div>
              <div>
                 <label className="block text-slate-400 text-sm font-bold mb-1">Cognome*</label>
                 <input 
                   type="text" 
                   value={formData.lastName}
                   onChange={e => setFormData({...formData, lastName: e.target.value})}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-slate-800 font-medium"
                 />
              </div>
              <div>
                 <label className="block text-slate-400 text-sm font-bold mb-1">Lavoro attuale o ideale*</label>
                 <div className="relative group">
                    <input 
                      type="text" 
                      value={formData.role}
                      onFocus={() => setShowSuggestions(true)}
                      onChange={e => {
                        setFormData({...formData, role: e.target.value});
                        setShowSuggestions(true);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-slate-800 font-medium relative z-10 bg-white"
                    />
                    {/* Suggestions Dropdown */}
                    {showSuggestions && formData.role && (
                       <>
                          {/* Invisible backdrop to close on click outside */}
                          <div className="fixed inset-0 z-0" onClick={() => setShowSuggestions(false)}></div>
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-2xl rounded-xl z-20 overflow-hidden animate-fade-in-up">
                             <div className="px-4 py-2 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Suggerimenti</div>
                             <div 
                                onClick={() => selectRole("It application manager")}
                                className="px-4 py-3 hover:bg-pink-50 text-slate-700 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-50"
                             >
                                <span>It application manager</span>
                                <Briefcase size={14} className="text-slate-300"/>
                             </div>
                             <div 
                                onClick={() => selectRole(formData.role)}
                                className="px-4 py-3 hover:bg-pink-50 text-slate-700 cursor-pointer bg-pink-50/30 font-bold flex justify-between items-center"
                             >
                                <span>{formData.role}</span>
                                <span className="text-[10px] text-pink-500 uppercase">Usa questo</span>
                             </div>
                          </div>
                       </>
                    )}
                 </div>
              </div>
           </div>

           <div className="flex justify-center max-w-sm mx-auto relative z-0">
              <Button onClick={handleNext} className="w-full shadow-pink-500/30" disabled={!formData.role || !formData.firstName}>Avanti</Button>
           </div>
        </Card>
      </div>
    );
  }

  // Step 3: Pronouns (Screenshot 3)
  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <Card className="text-center pb-12">
           <div className="flex justify-center mb-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <div className="w-3 h-3 rounded-full bg-slate-100"></div>
           </div>

           <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Come dovremmo riferirci a te?</h1>
           <p className="text-slate-500 mb-8 max-w-xs mx-auto">Seleziona i pronomi che dovremmo usare per descriverti nei risultati.</p>

           <div className="space-y-4 max-w-sm mx-auto mb-10">
              <div 
                 onClick={() => setFormData({...formData, pronoun: 'he'})}
                 className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-left relative group ${formData.pronoun === 'he' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-pink-200'}`}
              >
                 <div className="flex items-center gap-3 mb-2">
                    <User className={formData.pronoun === 'he' ? 'text-teal-600' : 'text-slate-400'} />
                    <span className="font-bold text-lg text-slate-800">Lui / gli</span>
                 </div>
                 <p className="text-sm text-slate-500">{formData.firstName} è orientato all'azione e gli piace affrontare nuove sfide.</p>
                 {formData.pronoun === 'he' && <Heart className="absolute top-4 right-4 text-teal-500 fill-teal-500" size={20} />}
              </div>

              <div 
                 onClick={() => setFormData({...formData, pronoun: 'she'})}
                 className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-left relative group ${formData.pronoun === 'she' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-pink-200'}`}
              >
                 <div className="flex items-center gap-3 mb-2">
                    <User className={formData.pronoun === 'she' ? 'text-teal-600' : 'text-slate-400'} />
                    <span className="font-bold text-lg text-slate-800">Lei / le</span>
                 </div>
                 <p className="text-sm text-slate-500">{formData.firstName} è orientata all'azione e le piace affrontare nuove sfide.</p>
                 {formData.pronoun === 'she' && <Heart className="absolute top-4 right-4 text-teal-500 fill-teal-500" size={20} />}
              </div>
           </div>

           <div className="flex justify-center max-w-sm mx-auto">
              <Button onClick={handleNext} className="w-full shadow-pink-500/30" disabled={!formData.pronoun}>Avanti</Button>
           </div>
        </Card>
      </div>
    );
  }

  // Step 4: Integration with Voice CV
  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-800">Ultimo step: La tua voce<span className="text-pink-500">.</span></h1>
          <p className="text-slate-500">Completa il profilo raccontandoci brevemente di te.</p>
       </div>
       <VoiceCV />
       <div className="flex justify-center mt-12">
          <Button onClick={onComplete} variant="secondary" className="px-12">Salta e vai alla Dashboard</Button>
       </div>
    </div>
  );
};

export default OnboardingWizard;