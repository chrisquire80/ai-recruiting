import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Check, User, Briefcase, Heart, Info, Upload, ShieldCheck } from 'lucide-react';
import VoiceCV from './VoiceCV';
import { useTranslation } from '../utils/i18n';
import { useCandidateContext } from '../context/CandidateContext';

interface Props {
  onComplete: () => void;
}

const OnboardingWizard: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: 'Christian',
    lastName: 'Robecchi',
    role: 'Product Designer',
    pronoun: '',
    termsAccepted: false,
    aiConsent: false
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAiInfo, setShowAiInfo] = useState(false);
  
  const { t } = useTranslation();
  const { updateCurrentCandidate } = useCandidateContext();
  
  // Accessibility: Ref to manage focus when step changes
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Move focus to the heading when step changes to alert screen readers
    headingRef.current?.focus();
  }, [step]);

  const handleNext = () => setStep(step + 1);
  
  const handleComplete = () => {
    updateCurrentCandidate({
        name: `${formData.firstName} ${formData.lastName}`,
        role: formData.role,
        aiConsent: formData.aiConsent
    });
    onComplete();
  };

  const selectRole = (role: string) => {
    setFormData({ ...formData, role });
    setShowSuggestions(false);
  };

  // Helper for keyboard interaction on custom controls
  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      callback();
    }
  };

  // Step 1: Privacy & Terms & AI Ethics
  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <Card className="text-center pb-12">
           <div className="flex justify-center mb-6 gap-2" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-100"></div>
           </div>
           
           <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold text-slate-800 mb-2 outline-none">
             {t('onboarding.step1.title')}<span className="text-pink-500">.</span>
           </h1>
           <p className="text-slate-500 mb-8">{t('onboarding.step1.subtitle')}</p>
           
           <div className="space-y-6 text-left max-w-sm mx-auto mb-10">
              <label htmlFor="terms" className="flex items-start gap-3 cursor-pointer group">
                 <div 
                    id="terms"
                    role="checkbox"
                    aria-checked={formData.termsAccepted}
                    tabIndex={0}
                    onClick={() => setFormData(p => ({...p, termsAccepted: !p.termsAccepted}))}
                    onKeyDown={(e) => handleKeyDown(e, () => setFormData(p => ({...p, termsAccepted: !p.termsAccepted})))}
                    className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors focus:ring-2 focus:ring-pink-500 focus:outline-none ${formData.termsAccepted ? 'bg-pink-500 text-white' : 'bg-slate-100 border border-slate-300'}`}
                 >
                    {formData.termsAccepted && <Check size={16} />}
                 </div>
                 <span className="text-slate-600 text-sm leading-tight">
                    {t('onboarding.step1.terms')}
                 </span>
              </label>
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <label htmlFor="aiConsent" className="flex items-start gap-3 cursor-pointer group mb-2">
                     <div 
                        id="aiConsent"
                        role="checkbox"
                        aria-checked={formData.aiConsent}
                        tabIndex={0}
                        onClick={() => setFormData(p => ({...p, aiConsent: !p.aiConsent}))}
                        onKeyDown={(e) => handleKeyDown(e, () => setFormData(p => ({...p, aiConsent: !p.aiConsent})))}
                        className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors focus:ring-2 focus:ring-pink-500 focus:outline-none ${formData.aiConsent ? 'bg-pink-500 text-white' : 'bg-slate-100 border border-slate-300'}`}
                     >
                        {formData.aiConsent && <Check size={16} />}
                     </div>
                     <span className="text-slate-800 font-bold text-sm leading-tight">
                        {t('onboarding.step1.aiConsent')}
                     </span>
                  </label>
                  <p className="text-xs text-slate-500 ml-9 mb-2">
                     {t('onboarding.step1.aiInfo')}
                  </p>
                  <button 
                    onClick={() => setShowAiInfo(!showAiInfo)}
                    className="ml-9 text-xs text-pink-600 font-bold flex items-center gap-1 hover:underline focus:outline-none focus:ring-2 focus:ring-pink-500 rounded p-0.5"
                    aria-expanded={showAiInfo}
                  >
                    <Info size={12} /> {t('onboarding.step1.howItWorks')}
                  </button>
                  
                  {showAiInfo && (
                    <div className="mt-3 ml-9 text-xs text-slate-600 bg-white p-3 rounded border border-slate-200 shadow-sm animate-fade-in" role="region" aria-label="AI Ethics Info">
                       <strong>{t('onboarding.step1.ethics')}:</strong><br/>
                       1. I tuoi dati vocali vengono trascritti e poi eliminati.<br/>
                       2. L'algoritmo suggerisce corrispondenze, ma un recruiter umano prende sempre la decisione finale.<br/>
                       3. Puoi revocare questo consenso in qualsiasi momento.
                    </div>
                  )}
              </div>
           </div>
           
           <div className="flex justify-between items-center max-w-sm mx-auto">
              <button className="font-bold text-slate-500 hover:text-slate-800 underline focus:outline-none focus:ring-2 focus:ring-slate-400 rounded px-2">{t('onboarding.back')}</button>
              <Button 
                onClick={handleNext} 
                className="shadow-pink-500/30"
                disabled={!formData.termsAccepted || !formData.aiConsent}
              >
                 {t('onboarding.next')}
              </Button>
           </div>
        </Card>
      </div>
    );
  }

  // Step 2: Personal Info
  if (step === 2) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <Card className="text-center pb-12">
           <div className="flex justify-center mb-6 gap-2" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-100"></div>
           </div>

           <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold text-slate-800 mb-8 outline-none">
            {t('onboarding.step2.title')}<span className="text-pink-500">.</span>
           </h1>

           <div className="space-y-5 text-left max-w-sm mx-auto mb-16 relative">
              <div>
                 <label htmlFor="firstName" className="block text-slate-400 text-sm font-bold mb-1">{t('onboarding.step2.firstName')}*</label>
                 <input 
                   id="firstName"
                   type="text" 
                   value={formData.firstName}
                   onChange={e => setFormData({...formData, firstName: e.target.value})}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-slate-800 font-medium"
                   aria-required="true"
                 />
              </div>
              <div>
                 <label htmlFor="lastName" className="block text-slate-400 text-sm font-bold mb-1">{t('onboarding.step2.lastName')}*</label>
                 <input 
                   id="lastName"
                   type="text" 
                   value={formData.lastName}
                   onChange={e => setFormData({...formData, lastName: e.target.value})}
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-slate-800 font-medium"
                   aria-required="true"
                 />
              </div>
              <div>
                 <label htmlFor="role" className="block text-slate-400 text-sm font-bold mb-1">{t('onboarding.step2.role')}*</label>
                 <div className="relative group">
                    <input 
                      id="role"
                      type="text" 
                      value={formData.role}
                      onFocus={() => setShowSuggestions(true)}
                      onChange={e => {
                        setFormData({...formData, role: e.target.value});
                        setShowSuggestions(true);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-slate-800 font-medium relative z-10 bg-white"
                      aria-haspopup="listbox"
                      aria-expanded={showSuggestions}
                      aria-required="true"
                    />
                    {/* Suggestions Dropdown */}
                    {showSuggestions && formData.role && (
                       <>
                          <div className="fixed inset-0 z-0" onClick={() => setShowSuggestions(false)} aria-hidden="true"></div>
                          <div 
                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-2xl rounded-xl z-20 overflow-hidden animate-fade-in-up"
                            role="listbox"
                          >
                             <div className="px-4 py-2 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">{t('onboarding.step2.suggestions')}</div>
                             <div 
                                role="option"
                                aria-selected={false}
                                onClick={() => selectRole("It application manager")}
                                className="px-4 py-3 hover:bg-pink-50 text-slate-700 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-50"
                             >
                                <span>It application manager</span>
                                <Briefcase size={14} className="text-slate-300"/>
                             </div>
                             <div 
                                role="option"
                                aria-selected={true}
                                onClick={() => selectRole(formData.role)}
                                className="px-4 py-3 hover:bg-pink-50 text-slate-700 cursor-pointer bg-pink-50/30 font-bold flex justify-between items-center"
                             >
                                <span>{formData.role}</span>
                                <span className="text-[10px] text-pink-500 uppercase">{t('onboarding.step2.useThis')}</span>
                             </div>
                          </div>
                       </>
                    )}
                 </div>
              </div>
           </div>

           <div className="flex justify-center max-w-sm mx-auto relative z-0">
              <Button onClick={handleNext} className="w-full shadow-pink-500/30" disabled={!formData.role || !formData.firstName}>{t('onboarding.next')}</Button>
           </div>
        </Card>
      </div>
    );
  }

  // Step 3: Pronouns
  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <Card className="text-center pb-12">
           <div className="flex justify-center mb-6 gap-2" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-pink-200"></div>
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <div className="w-3 h-3 rounded-full bg-slate-100"></div>
           </div>

           <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold text-slate-800 mb-2 outline-none">
             {t('onboarding.step3.title')}
           </h1>
           <p className="text-slate-500 mb-8 max-w-xs mx-auto">{t('onboarding.step3.subtitle')}</p>

           <div className="space-y-4 max-w-sm mx-auto mb-10" role="radiogroup" aria-label="Select your pronouns">
              <div 
                 role="radio"
                 aria-checked={formData.pronoun === 'he'}
                 tabIndex={0}
                 onClick={() => setFormData({...formData, pronoun: 'he'})}
                 onKeyDown={(e) => handleKeyDown(e, () => setFormData({...formData, pronoun: 'he'}))}
                 className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-left relative group focus:outline-none focus:ring-2 focus:ring-pink-500 ${formData.pronoun === 'he' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-pink-200'}`}
              >
                 <div className="flex items-center gap-3 mb-2">
                    <User className={formData.pronoun === 'he' ? 'text-teal-600' : 'text-slate-400'} />
                    <span className="font-bold text-lg text-slate-800">{t('onboarding.step3.he')}</span>
                 </div>
                 <p className="text-sm text-slate-500">{formData.firstName} {t('onboarding.step3.heDesc')}</p>
                 {formData.pronoun === 'he' && <Heart className="absolute top-4 right-4 text-teal-500 fill-teal-500" size={20} />}
              </div>

              <div 
                 role="radio"
                 aria-checked={formData.pronoun === 'she'}
                 tabIndex={0}
                 onClick={() => setFormData({...formData, pronoun: 'she'})}
                 onKeyDown={(e) => handleKeyDown(e, () => setFormData({...formData, pronoun: 'she'}))}
                 className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-left relative group focus:outline-none focus:ring-2 focus:ring-pink-500 ${formData.pronoun === 'she' ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-pink-200'}`}
              >
                 <div className="flex items-center gap-3 mb-2">
                    <User className={formData.pronoun === 'she' ? 'text-teal-600' : 'text-slate-400'} />
                    <span className="font-bold text-lg text-slate-800">{t('onboarding.step3.she')}</span>
                 </div>
                 <p className="text-sm text-slate-500">{formData.firstName} {t('onboarding.step3.sheDesc')}</p>
                 {formData.pronoun === 'she' && <Heart className="absolute top-4 right-4 text-teal-500 fill-teal-500" size={20} />}
              </div>
           </div>

           <div className="flex justify-center max-w-sm mx-auto">
              <Button onClick={handleNext} className="w-full shadow-pink-500/30" disabled={!formData.pronoun}>{t('onboarding.next')}</Button>
           </div>
        </Card>
      </div>
    );
  }

  // Step 4: Integration with Voice CV OR Manual Option
  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-8 text-center">
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold text-slate-800 outline-none">
            {t('onboarding.step4.title')}<span className="text-pink-500">.</span>
          </h1>
          <p className="text-slate-500">{t('onboarding.step4.subtitle')}</p>
       </div>
       
       <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="bg-pink-50 border border-pink-100 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 text-pink-700 font-bold mb-2">
                    <ShieldCheck size={20} />
                    <span>{t('onboarding.step4.ethicalAI')}</span>
                </div>
                <p className="text-sm text-pink-800/80 leading-relaxed">
                    {t('onboarding.step4.ethicalDesc')}
                </p>
            </div>
            <VoiceCV />
          </div>

          <div className="md:mt-24">
             <div className="relative">
                 <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-slate-200"></div>
                 </div>
                 <div className="relative flex justify-center text-sm">
                     <span className="px-2 bg-gradient-to-br from-pink-50 to-orange-50 text-slate-400 font-bold uppercase">{t('onboarding.step4.or')}</span>
                 </div>
             </div>

             <Card className="mt-8 text-center py-10 border-2 border-dashed border-slate-200 hover:border-pink-300 transition-colors cursor-pointer group">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-50 transition-colors">
                    <Upload className="text-slate-400 group-hover:text-pink-500" size={32} />
                 </div>
                 <h3 className="text-lg font-bold text-slate-800">{t('onboarding.step4.manualUpload')}</h3>
                 <p className="text-slate-400 text-sm mb-6">{t('onboarding.step4.fileType')}</p>
                 <Button variant="secondary" onClick={handleComplete} className="w-full max-w-xs">
                    {t('onboarding.step4.noAI')}
                 </Button>
                 <p className="text-xs text-slate-400 mt-4 max-w-xs mx-auto">
                    {t('onboarding.step4.manualDesc')}
                 </p>
             </Card>
          </div>
       </div>
    </div>
  );
};

export default OnboardingWizard;