import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { DrugInput } from './components/DrugInput';
import { Dashboard } from './components/Dashboard';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzePharmacogenomics } from './services/api';
import { AnalysisResult } from './types';
import { ArrowRight, Loader2, Sparkles, ShieldCheck, Zap, FileJson, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'analysis' | 'dashboard'>('analysis');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [drug, setDrug] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    if (!file || !drug) return;

    setIsAnalyzing(true);
    setError(null);
    setResults([]);

    try {
      const analysisResults = await analyzePharmacogenomics(file, drug);
      setResults(analysisResults);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      <Header currentView={view} setCurrentView={setView} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {view === 'analysis' ? (
          <>
            {/* Intro / Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3 h-3" />
                Next-Gen Pharmacogenomics
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                Optimize Therapy with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Genetic Intelligence</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                PharmaGuard analyzes patient genomic variants against CPIC rules to prevent adverse drug reactions before the first dose is prescribed.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Input Panel */}
              <div className="lg:col-span-4 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="glass-card rounded-3xl p-8 border border-white/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>

                  <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <div className="bg-teal-600 p-1.5 rounded-lg shadow-lg shadow-teal-600/20">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    Configuration
                  </h2>

                  <div className="space-y-8">
                    <FileUpload
                      file={file}
                      setFile={setFile}
                      error={fileError}
                      setError={setFileError}
                    />

                    <DrugInput
                      drug={drug}
                      setDrug={setDrug}
                    />

                    <button
                      onClick={handleAnalysis}
                      disabled={!file || !drug || isAnalyzing || !!fileError}
                      className={`
                        w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 text-sm font-black transition-all group
                        ${!file || !drug || isAnalyzing || !!fileError
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-teal-600 shadow-xl shadow-slate-900/10 hover:shadow-teal-600/20 transform hover:-translate-y-1 active:scale-95'}
                      `}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing Sequence...
                        </>
                      ) : (
                        <>
                          Generate Clinical Report
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {error && (
                      <div className="p-4 bg-rose-50 text-rose-700 text-[13px] font-bold rounded-2xl border border-rose-100 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <div>
                          <p className="font-black uppercase text-[10px] mb-1">Upload Error</p>
                          {error}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="glass-card p-5 rounded-2xl border border-white/50 flex items-center gap-4 group hover:bg-white/60 transition-colors">
                    <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-[13px] text-slate-950 uppercase tracking-tight">CPIC v4.2 Certified</h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 text-left">Ruleset updated for 2024 standardized dosing.</p>
                    </div>
                  </div>
                  <div className="glass-card p-5 rounded-2xl border border-white/50 flex items-center gap-4 group hover:bg-white/60 transition-colors">
                    <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-[13px] text-slate-950 uppercase tracking-tight">VCF Neural Parser</h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 text-left">Gemini 1.5 Flash handles multi-GB files in seconds.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Results */}
              <div className="lg:col-span-8 space-y-8">
                {results.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center glass-card p-5 rounded-2xl border border-white/50 animate-fade-in shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-950 text-white px-3 py-1 rounded-xl text-xs font-black">
                          {results.length}
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Identified Risk Profiles</h3>
                      </div>
                      <button
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
                          const downloadAnchorNode = document.createElement('a');
                          downloadAnchorNode.setAttribute("href", dataStr);
                          downloadAnchorNode.setAttribute("download", `pgx_report_${new Date().getTime()}.json`);
                          downloadAnchorNode.click();
                          downloadAnchorNode.remove();
                        }}
                        className="flex items-center gap-2 text-[12px] font-black text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100"
                      >
                        <FileJson className="w-4 h-4" />
                        EXPORT BUNDLE
                      </button>
                    </div>
                    {results.map((res, index) => (
                      <ResultsDisplay key={`${res.drug}-${index}`} result={res} />
                    ))}
                  </>
                ) : (
                  <div className="h-full min-h-[500px] flex flex-col items-center justify-center glass-card rounded-3xl border-2 border-dashed border-slate-300 p-12 text-center animate-fade-in group">
                    <div className="bg-white/50 p-8 rounded-full mb-6 shadow-xl shadow-slate-200/50 group-hover:scale-110 transition-transform duration-500">
                      <ActivityPlaceholder className="w-16 h-16 text-slate-300 group-hover:text-teal-500 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Awaiting Diagnostic Input</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                      Upload a clinical VCF sample (Person 1) and enter target drugs (Person 2) to initiate AI-powered genomic mapping.
                    </p>
                    <div className="mt-8 flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <Dashboard />
        )}
      </main>

      <footer className="bg-white/30 backdrop-blur-md border-t border-white/20 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center gap-6 text-slate-400 grayscale hover:grayscale-0 transition-all opacity-50">
            <span className="font-black text-xs tracking-tighter">CPIC</span>
            <span className="font-black text-xs tracking-tighter">PHARMGKB</span>
            <span className="font-black text-xs tracking-tighter">NCBI</span>
          </div>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
            &copy; 2024 PharmaGuard AI • Clinical Decision Support System • RIFT 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

function ActivityPlaceholder({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export default App;