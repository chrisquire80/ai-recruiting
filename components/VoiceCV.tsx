import React, { useState, useEffect } from 'react';
import { Mic, FileText, Loader2, StopCircle, Download, CheckCircle, RefreshCw, AlertTriangle, AlertCircle } from 'lucide-react';
import { CVData } from '../types';
import { generateCVFromTranscript } from '../services/geminiService';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const VoiceCV: React.FC = () => {
  const { 
    isRecording, 
    recordingTime, 
    transcript, 
    permissionError, 
    isProcessingSTT, 
    startRecording, 
    stopRecording,
    resetRecording 
  } = useVoiceRecorder();

  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    if (transcript && !cvData && !isGeneratingCV && !generationError) {
      handleGenerateCV(transcript);
    }
  }, [transcript, cvData, isGeneratingCV, generationError]);

  const handleGenerateCV = async (text: string) => {
    setIsGeneratingCV(true);
    setGenerationError(null);
    try {
      const data = await generateCVFromTranscript(text);
      if (data) {
        setCvData(data);
      } else {
        setGenerationError("Impossibile estrarre i dati strutturati.");
      }
    } catch (e) {
      console.error("Error generating CV:", e);
      setGenerationError("Servizio AI temporaneamente non disponibile.");
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const handleReset = () => {
    resetRecording();
    setCvData(null);
    setGenerationError(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isAiBusy = isProcessingSTT || isGeneratingCV || (transcript && !cvData && !generationError);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {permissionError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-fade-in text-red-700 shadow-sm">
           <AlertTriangle className="shrink-0 mt-0.5" size={20} />
           <div className="space-y-1">
             <h4 className="font-bold text-sm">Problema accesso microfono</h4>
             <p className="text-sm opacity-90">{permissionError}</p>
           </div>
        </div>
      )}

      <Card className="text-center relative overflow-visible border-none shadow-none bg-transparent">
        <div className="space-y-4">
          <div className="flex justify-center items-center py-6 min-h-[200px]">
            {/* AssessFirst Style Pulse Button */}
            <div className={`relative flex items-center justify-center w-40 h-40 rounded-full transition-all duration-500 ${isRecording ? 'bg-pink-50 scale-110 shadow-xl shadow-pink-200' : 'bg-white shadow-2xl shadow-slate-100'}`}>
              
              {isRecording && (
                 <>
                   <div className="absolute inset-0 rounded-full animate-ping bg-pink-400 opacity-20"></div>
                   <div className="absolute -inset-4 rounded-full border border-pink-200 animate-pulse"></div>
                 </>
              )}
              
              {!isRecording && !isAiBusy && !cvData && !generationError && (
                <button 
                  onClick={startRecording} 
                  disabled={!!permissionError}
                  className="z-10 flex flex-col items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors group w-full h-full justify-center rounded-full focus:outline-none disabled:opacity-50"
                >
                  <Mic size={48} className="group-hover:scale-110 transition-transform text-pink-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Registra</span>
                </button>
              )}

              {isRecording && (
                <button 
                  onClick={stopRecording} 
                  className="z-10 flex flex-col items-center gap-2 text-pink-600 hover:scale-105 transition-transform w-full h-full justify-center rounded-full focus:outline-none"
                >
                  <StopCircle size={48} />
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black font-mono tracking-widest">{formatTime(recordingTime)}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Stop</span>
                  </div>
                </button>
              )}

              {isProcessingSTT && (
                <div className="z-10 flex flex-col items-center gap-2 text-pink-500">
                  <Loader2 size={42} className="animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Ascolto...</span>
                </div>
              )}

              {!isProcessingSTT && isAiBusy && (
                <div className="z-10 flex flex-col items-center gap-2 text-orange-500 animate-pulse">
                   <div className="relative">
                      <FileText size={42} />
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-wider">Analisi AI...</span>
                </div>
              )}

              {generationError && (
                <button 
                  onClick={() => transcript && handleGenerateCV(transcript)}
                  className="z-10 flex flex-col items-center gap-2 text-amber-500 hover:text-amber-600 w-full h-full justify-center rounded-full"
                >
                   <AlertCircle size={42} />
                   <span className="text-[10px] font-bold uppercase tracking-wider">Riprova</span>
                </button>
              )}

              {!isRecording && !isAiBusy && cvData && (
                 <div className="z-10 flex flex-col items-center gap-2 text-emerald-500">
                    <CheckCircle size={48} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Fatto!</span>
                 </div>
              )}
            </div>
          </div>
        </div>

        {transcript && (
          <div className="mt-8 p-8 bg-white rounded-3xl border border-white shadow-lg text-left relative group animate-fade-in-up">
             <div className="absolute -top-3 left-6 bg-pink-50 text-pink-600 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-pink-100">
               Trascrizione
             </div>
             <p className="text-slate-600 italic leading-relaxed text-lg">"{transcript}"</p>
          </div>
        )}
      </Card>

      {cvData && (
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-8 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div>
                 <span className="font-bold block text-xl">Profilo Creato</span>
                 <span className="text-sm text-pink-100 opacity-90">AI Analysis completata con successo</span>
              </div>
            </div>
            <div className="flex gap-2">
                <button className="p-3 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm" title="Download PDF">
                    <Download size={24} />
                </button>
            </div>
          </div>
          
          <div className="p-10 grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1 space-y-8">
              <div className="text-center md:text-left">
                <div className="w-28 h-28 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mx-auto md:mx-0 mb-6 flex items-center justify-center text-4xl font-bold text-pink-400 border-4 border-white shadow-xl">
                   {cvData.fullName.charAt(0)}
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Candidato</h3>
                <p className="text-3xl font-extrabold text-slate-800">{cvData.fullName}</p>
              </div>
              
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Skills Rilevate</h3>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-bold border border-slate-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-10">
               <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Sommario Professionale</h3>
                <div className="p-8 bg-orange-50/50 rounded-3xl border border-orange-100/50">
                   <p className="text-slate-700 leading-relaxed text-lg font-medium">{cvData.summary}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Esperienza Lavorativa</h3>
                <div className="space-y-6">
                  {cvData.experience.map((exp, i) => (
                    <div key={i} className="flex gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                       <div className="mt-1 flex-shrink-0">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-md">
                             <FileText size={24} />
                          </div>
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-800 text-xl">{exp.role}</h4>
                          <div className="flex items-center gap-3 text-sm text-slate-500 mt-2">
                             <span className="font-semibold text-slate-600">{exp.company}</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                             <span>{exp.duration}</span>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-4">
            <Button variant="ghost" icon={RefreshCw} onClick={handleReset}>Ricomincia</Button>
            <Button className="shadow-lg shadow-pink-500/30" icon={CheckCircle}>Conferma Profilo</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCV;