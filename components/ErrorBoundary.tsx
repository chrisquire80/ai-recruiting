import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 m-4 animate-fade-in shadow-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 shadow-sm ring-4 ring-red-50">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h2>
          <p className="text-slate-500 mb-6 max-w-md text-sm leading-relaxed">
            The application encountered an unexpected error. We have paused execution to prevent data loss.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20 font-medium"
          >
            <RefreshCw size={18} />
            Reload Application
          </button>
          {this.state.error && (
            <div className="mt-8 w-full max-w-lg">
               <details className="text-left group cursor-pointer">
                  <summary className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-hover:text-slate-600 transition-colors list-none flex items-center gap-2">
                    <span>Show Error Trace</span>
                    <span className="w-full h-px bg-slate-200"></span>
                  </summary>
                  <pre className="p-4 bg-slate-100 rounded-lg text-[10px] leading-relaxed text-slate-600 overflow-auto font-mono border border-slate-200 shadow-inner max-h-64">
                    {this.state.error.toString()}
                  </pre>
               </details>
            </div>
          )}
        </div>
      );
    }

    // Fix: Access props via explicit cast to avoid TS error about missing property
    return (this as any).props.children;
  }
}

export default ErrorBoundary;