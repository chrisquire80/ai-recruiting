
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'it' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  it: {
    // Layout
    'layout.step': 'Passo',
    'layout.search': 'Cerca candidati...',
    'layout.profile': 'Il mio Profilo',
    'layout.voiceCv': 'Voice CV',
    'layout.skillMatrix': 'Skill Matrix',
    'layout.employability': 'Employability',
    'layout.jobMatching': 'Job Matching',
    'layout.dashboard': 'Dashboard',
    'layout.reservedArea': 'Area Riservata',
    'layout.updateVoiceCv': 'Aggiorna CV Vocale',
    'layout.aiRecruiting': 'AI Recruiting',
    'layout.profileSummary': 'Sintesi del Profilo',
    'layout.potential': 'Potenziale',
    
    // Onboarding
    'onboarding.back': 'Indietro',
    'onboarding.next': 'Avanti',
    'onboarding.step1.title': 'Crea il tuo account',
    'onboarding.step1.subtitle': 'Trasparenza e controllo sui tuoi dati.',
    'onboarding.step1.terms': 'Accetto termini e condizioni e la Normativa sulla privacy.',
    'onboarding.step1.aiConsent': 'Acconsento all\'analisi AI del mio profilo.',
    'onboarding.step1.aiInfo': 'Utilizziamo l\'IA per analizzare le competenze. Non usiamo i dati per decisioni automatizzate esclusive.',
    'onboarding.step1.howItWorks': 'Come funziona la nostra IA?',
    'onboarding.step1.ethics': 'Etica dell\'IA',
    
    'onboarding.step2.title': 'Parlaci di te',
    'onboarding.step2.firstName': 'Nome',
    'onboarding.step2.lastName': 'Cognome',
    'onboarding.step2.role': 'Lavoro attuale o ideale',
    'onboarding.step2.suggestions': 'Suggerimenti',
    'onboarding.step2.useThis': 'Usa questo',

    'onboarding.step3.title': 'Come dovremmo riferirci a te?',
    'onboarding.step3.subtitle': 'Seleziona i pronomi che dovremmo usare per descriverti nei risultati.',
    'onboarding.step3.he': 'Lui / gli',
    'onboarding.step3.heDesc': 'orientato all\'azione e gli piace affrontare nuove sfide.',
    'onboarding.step3.she': 'Lei / le',
    'onboarding.step3.sheDesc': 'orientata all\'azione e le piace affrontare nuove sfide.',

    'onboarding.step4.title': 'Ultimo step: Scegli come presentarti',
    'onboarding.step4.subtitle': 'Usa la nostra IA vocale per velocità o carica un CV tradizionale.',
    'onboarding.step4.ethicalAI': 'IA Etica & Trasparente',
    'onboarding.step4.ethicalDesc': 'La tua voce verrà usata solo per estrarre le competenze. Nessun dato biometrico viene conservato. L\'analisi è un supporto per i recruiter.',
    'onboarding.step4.or': 'Oppure',
    'onboarding.step4.manualUpload': 'Carica CV Tradizionale',
    'onboarding.step4.fileType': 'PDF, DOCX fino a 5MB',
    'onboarding.step4.noAI': 'Preferisco non usare l\'IA',
    'onboarding.step4.manualDesc': 'Selezionando questa opzione, il tuo profilo verrà valutato manualmente dai recruiter senza il pre-screening dell\'IA.',

    // Report
    'report.summary': 'Sintesi del profilo',
    'report.share': 'Condividi',
    'report.section1': 'Sezione #1',
    'report.personality': 'ANALISI DELLA PERSONALITÀ',
    'report.style': 'Stile Personale',
    'report.strengths': 'Principali punti di forza',
    'report.relations': 'Gestione delle relazioni',
    'report.work': 'Gestione del lavoro',
    'report.improvement': 'Aree di miglioramento',
    'report.section2': 'Sezione #2',
    'report.talentCloud': 'TALENT CLOUD',
    'report.predictive': 'Le competenze comportamentali predittive',
    'report.section3': 'Sezione #3',
    'report.motivations': 'MOTIVAZIONI & MANAGEMENT',
    'report.keyFactors': 'Fattori Chiave',
    'report.motivators': 'Ciò che lo motiva',
    'report.demotivators': 'Ciò che lo demotiva',
    'report.privacyTitle': 'Privacy & Data Control',
    'report.privacyDesc': 'In conformità con il GDPR, hai il pieno controllo sui tuoi dati. Puoi richiedere una copia dei tuoi dati (Diritto di Accesso) o eliminare permanentemente il tuo account (Diritto all\'Oblio).',
    'report.export': 'Esporta Dati',
    'report.delete': 'Elimina Account',
  },
  en: {
    // Layout
    'layout.step': 'Step',
    'layout.search': 'Search candidates...',
    'layout.profile': 'My Profile',
    'layout.voiceCv': 'Voice CV',
    'layout.skillMatrix': 'Skill Matrix',
    'layout.employability': 'Employability',
    'layout.jobMatching': 'Job Matching',
    'layout.dashboard': 'Dashboard',
    'layout.reservedArea': 'Reserved Area',
    'layout.updateVoiceCv': 'Update Voice CV',
    'layout.aiRecruiting': 'AI Recruiting',
    'layout.profileSummary': 'Profile Summary',
    'layout.potential': 'Potential',

    // Onboarding
    'onboarding.back': 'Back',
    'onboarding.next': 'Next',
    'onboarding.step1.title': 'Create your account',
    'onboarding.step1.subtitle': 'Transparency and control over your data.',
    'onboarding.step1.terms': 'I accept terms and conditions and the Privacy Policy.',
    'onboarding.step1.aiConsent': 'I consent to AI analysis of my profile.',
    'onboarding.step1.aiInfo': 'We use AI to analyze skills. We do not use data for automated decision-making only.',
    'onboarding.step1.howItWorks': 'How does our AI work?',
    'onboarding.step1.ethics': 'AI Ethics',
    
    'onboarding.step2.title': 'Tell us about yourself',
    'onboarding.step2.firstName': 'First Name',
    'onboarding.step2.lastName': 'Last Name',
    'onboarding.step2.role': 'Current or Ideal Role',
    'onboarding.step2.suggestions': 'Suggestions',
    'onboarding.step2.useThis': 'Use this',

    'onboarding.step3.title': 'How should we refer to you?',
    'onboarding.step3.subtitle': 'Select pronouns we should use to describe you in results.',
    'onboarding.step3.he': 'He / Him',
    'onboarding.step3.heDesc': 'is action-oriented and likes facing new challenges.',
    'onboarding.step3.she': 'She / Her',
    'onboarding.step3.sheDesc': 'is action-oriented and likes facing new challenges.',

    'onboarding.step4.title': 'Last step: Choose how to introduce yourself',
    'onboarding.step4.subtitle': 'Use our Voice AI for speed or upload a traditional CV.',
    'onboarding.step4.ethicalAI': 'Ethical & Transparent AI',
    'onboarding.step4.ethicalDesc': 'Your voice is used only to extract skills. No biometric data is stored. Analysis supports recruiters.',
    'onboarding.step4.or': 'Or',
    'onboarding.step4.manualUpload': 'Upload Traditional CV',
    'onboarding.step4.fileType': 'PDF, DOCX up to 5MB',
    'onboarding.step4.noAI': 'I prefer not to use AI',
    'onboarding.step4.manualDesc': 'By selecting this option, your profile will be manually evaluated by recruiters without AI pre-screening.',

    // Report
    'report.summary': 'Profile Summary',
    'report.share': 'Share',
    'report.section1': 'Section #1',
    'report.personality': 'PERSONALITY ANALYSIS',
    'report.style': 'Personal Style',
    'report.strengths': 'Key Strengths',
    'report.relations': 'Relationship Management',
    'report.work': 'Work Management',
    'report.improvement': 'Areas of Improvement',
    'report.section2': 'Section #2',
    'report.talentCloud': 'TALENT CLOUD',
    'report.predictive': 'Predictive behavioral competencies',
    'report.section3': 'Section #3',
    'report.motivations': 'MOTIVATIONS & MANAGEMENT',
    'report.keyFactors': 'Key Factors',
    'report.motivators': 'Motivators',
    'report.demotivators': 'Demotivators',
    'report.privacyTitle': 'Privacy & Data Control',
    'report.privacyDesc': 'In compliance with GDPR, you have full control over your data. You can request a copy of your data (Right of Access) or permanently delete your account (Right to Erasure).',
    'report.export': 'Export Data',
    'report.delete': 'Delete Account',
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('it');

  const t = (key: string): string => {
    // Fix: Direct access to flat key structure
    const dict = translations[language] as Record<string, string>;
    return dict[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
