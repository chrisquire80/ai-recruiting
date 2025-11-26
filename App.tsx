
import React, { useState, Suspense } from 'react';
import { ViewState } from './types';
import { Layout } from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';
import OnboardingWizard from './components/OnboardingWizard';
import { I18nProvider } from './utils/i18n';
import { CandidateProvider } from './context/CandidateContext';

// Lazy load feature modules
const VoiceCV = React.lazy(() => import('./components/VoiceCV'));
const SkillMatrix = React.lazy(() => import('./components/SkillMatrix'));
const Employability = React.lazy(() => import('./components/Employability'));
const JobMatching = React.lazy(() => import('./components/JobMatching'));
const AssessmentReport = React.lazy(() => import('./components/AssessmentReport'));
const HrAnalytics = React.lazy(() => import('./components/HrAnalytics'));

const App: React.FC = () => {
  // Start with Onboarding for demo flow
  const [view, setView] = useState<ViewState>('ONBOARDING');

  const LoadingScreen = () => (
    <div className="h-full w-full min-h-[500px] flex flex-col items-center justify-center text-slate-400">
      <div className="relative">
        <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full"></div>
        <Loader2 size={48} className="animate-spin relative z-10 text-pink-500" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
        Caricamento...
      </p>
    </div>
  );

  return (
    <I18nProvider>
      <CandidateProvider>
        <ErrorBoundary>
          <Layout currentView={view} setView={setView}>
            <Suspense fallback={<LoadingScreen />}>
              <div className="animate-fade-in duration-500">
                {view === 'ONBOARDING' && <OnboardingWizard onComplete={() => setView('REPORT')} />}
                {view === 'REPORT' && <AssessmentReport />}
                {view === 'VOICE_CV' && <VoiceCV />}
                {view === 'SKILL_MATRIX' && <SkillMatrix />}
                {view === 'EMPLOYABILITY' && <Employability />}
                {view === 'JOB_MATCHING' && <JobMatching />}
                {view === 'DASHBOARD' && <HrAnalytics />}
              </div>
            </Suspense>
          </Layout>
        </ErrorBoundary>
      </CandidateProvider>
    </I18nProvider>
  );
};

export default App;
