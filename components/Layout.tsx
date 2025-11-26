
import React, { useState } from 'react';
import { ViewState } from '../types';
import { Mic, Target, Users, BarChart3, Bell, Menu, X, Settings, Search, LayoutDashboard, FileText, UserCircle, Globe } from 'lucide-react';
import { useTranslation } from '../utils/i18n';
import Chatbot from './Chatbot';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'it' ? 'en' : 'it');
  };

  // If in Onboarding mode, show simplified layout (no sidebar)
  if (currentView === 'ONBOARDING') {
      return (
          <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 font-sans p-6">
              <header className="flex justify-between items-center max-w-6xl mx-auto mb-8">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 p-0.5">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                           <img src="https://api.iconify.design/noto:unicorn.svg" alt="logo" className="w-5 h-5" />
                        </div>
                     </div>
                     <span className="font-extrabold text-slate-800 text-lg">AssessFirst</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <button 
                        onClick={toggleLanguage} 
                        className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-pink-600 uppercase"
                        aria-label="Toggle Language"
                     >
                        <Globe size={14} /> {language}
                     </button>
                     <div className="text-sm font-bold text-slate-400">{t('layout.step')} 1/4</div>
                  </div>
              </header>
              <main>
                  {children}
              </main>
              <Chatbot />
          </div>
      );
  }

  const NavItem = ({ target, icon: Icon, label }: { target: ViewState; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => {
        setView(target);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-300 group relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 ${
        currentView === target 
        ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/30 font-bold' 
        : 'text-slate-500 hover:bg-white hover:shadow-md hover:text-slate-800 font-medium'
      }`}
      aria-current={currentView === target ? 'page' : undefined}
    >
      <Icon size={20} className={`relative z-10 transition-transform duration-300 ${currentView === target ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="relative z-10">{label}</span>
    </button>
  );

  const getPageTitle = () => {
    switch (currentView) {
      case 'REPORT': return t('layout.profileSummary');
      case 'VOICE_CV': return t('layout.updateVoiceCv');
      case 'JOB_MATCHING': return t('layout.aiRecruiting');
      case 'SKILL_MATRIX': return t('layout.skillMatrix');
      case 'EMPLOYABILITY': return t('layout.employability');
      case 'DASHBOARD': return 'HR Analytics';
      default: return t('layout.dashboard');
    }
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden font-sans">
      {/* Sidebar - White Glassmorphism Style */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/60 backdrop-blur-2xl border-r border-white/50 text-slate-800 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 p-0.5 shadow-md">
                 <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <img src="https://api.iconify.design/noto:unicorn.svg" alt="logo" className="w-6 h-6" />
                 </div>
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-800">AssessFirst</h1>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            <NavItem target="REPORT" icon={UserCircle} label={t('layout.profile')} />
            <NavItem target="VOICE_CV" icon={Mic} label={t('layout.voiceCv')} />
            <NavItem target="SKILL_MATRIX" icon={Target} label={t('layout.skillMatrix')} />
            <NavItem target="EMPLOYABILITY" icon={BarChart3} label={t('layout.employability')} />
            <NavItem target="JOB_MATCHING" icon={Users} label={t('layout.jobMatching')} />
            <NavItem target="DASHBOARD" icon={LayoutDashboard} label="HR Analytics" />
          </nav>
        </div>

        <div className="mt-auto p-6">
             <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform" role="button" tabIndex={0}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl -mr-6 -mt-6"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/20 rounded-full blur-xl -ml-6 -mb-6"></div>
                
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400">{t('layout.potential')}</p>
                <div className="flex justify-between items-end">
                   <span className="text-3xl font-extrabold tracking-tight">Top 5%</span>
                   <Settings className="text-slate-400 group-hover:text-white transition-colors" size={20} />
                </div>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/60 backdrop-blur-md border-b border-slate-100 p-4 flex justify-between items-center z-40 sticky top-0">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 p-0.5">
                 <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <span className="font-bold text-xs">AF</span>
                 </div>
             </div>
             <span className="font-bold text-slate-800">AssessFirst</span>
           </div>
           <button 
             onClick={() => setSidebarOpen(true)} 
             className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
             aria-label="Open menu"
           >
             <Menu />
           </button>
        </header>

        {/* Topbar */}
        <div className="hidden lg:flex justify-between items-center px-10 py-6 sticky top-0 z-30">
           <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('layout.reservedArea')}</span>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  {getPageTitle()}
              </h2>
           </div>
           
           <div className="flex items-center gap-6">
              <button 
                  onClick={toggleLanguage} 
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-pink-600 uppercase transition-colors px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                  title="Switch Language"
               >
                  <Globe size={16} /> {language === 'it' ? 'English' : 'Italiano'}
              </button>

              <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder={t('layout.search')}
                    className="pl-12 pr-4 py-3 bg-white border-none rounded-full text-sm shadow-sm focus:ring-2 focus:ring-pink-500 w-64 transition-all placeholder:text-slate-400 hover:shadow-md outline-none"
                    aria-label={t('layout.search')}
                  />
              </div>

              <button 
                className="p-3 text-slate-400 hover:text-pink-500 relative bg-white hover:bg-pink-50 rounded-full transition-all shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                aria-label="Notifications"
              >
                 <Bell size={20} />
                 <span className="absolute top-2.5 right-3 w-2 h-2 bg-pink-500 rounded-full ring-2 ring-white"></span>
              </button>
              
              <button 
                className="flex items-center gap-3 pl-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-full" 
                onClick={() => setView('REPORT')}
                aria-label="Go to Profile"
              >
                 <div className="text-right hidden xl:block">
                    <div className="text-sm font-bold text-slate-800">Riccardo Pinna</div>
                    <div className="text-xs text-slate-500">Product Designer</div>
                 </div>
                 <div className="w-12 h-12 rounded-full p-1 bg-gradient-to-tr from-orange-400 to-pink-500 shadow-md hover:scale-105 transition-transform">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                 </div>
              </button>
           </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 relative scroll-smooth" role="main">
           <div className="max-w-7xl mx-auto space-y-8 pb-12">
             {children}
           </div>
        </div>
        
        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" onClick={() => setSidebarOpen(false)}></div>
        )}

        <Chatbot />
      </main>
    </div>
  );
};
