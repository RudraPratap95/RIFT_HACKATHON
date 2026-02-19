import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { DrugInput } from './components/DrugInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { parseAndFilterVCF } from './services/vcfUtils';
import { analyzePharmacogenomics } from './services/geminiService';
import { AnalysisResult } from './types';
import { ArrowRight, Loader2, Sparkles, ShieldCheck, Zap, FileJson } from 'lucide-react';

const App: React.FC = () => {
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
      // 1. Parse VCF locally to get relevant context
      const vcfContext = await parseAndFilterVCF(file);

      // 2. Split drugs by comma and trim
      const drugList = drug.split(',').map(d => d.trim()).filter(d => d.length > 0);

      if (drugList.length === 0) {
        throw new Error("Please enter at least one drug name.");
      }

      const allResults: AnalysisResult[] = [];

      // 3. Process each drug (sequential to avoid rate limits/overwhelming context)
      for (const currentDrug of drugList) {
        const analysisResult = await analyzePharmacogenomics(vcfContext, currentDrug);
        allResults.push(analysisResult);
      }

      // 4. Set Results
      setResults(allResults);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Intro / Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Personalized Drug Safety Analysis
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Upload patient VCF data to detect pharmacogenomic risks.
            Powered by AI and CPIC guidelines to prevent adverse drug reactions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Input Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                New Analysis
              </h2>

              <div className="space-y-6">
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
                    w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all
                    ${!file || !drug || isAnalyzing || !!fileError
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}
                  `}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Genome...
                    </>
                  ) : (
                    <>
                      Analyze Risk Profile
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                    <strong>Analysis Failed:</strong> {error}
                  </div>
                )}
              </div>
            </div>

            {/* Feature Highlights (Visible on desktop) */}
            <div className="hidden lg:grid grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">CPIC Aligned</h3>
                  <p className="text-xs text-slate-500 mt-1">Recommendations based on latest Clinical Pharmacogenetics Implementation Consortium guidelines.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">Instant AI Parsing</h3>
                  <p className="text-xs text-slate-500 mt-1">Analyzes complex VCF files in seconds using Gemini 1.5 Flash.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-8">
            {results.length > 0 ? (
              <>
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800">Analysis Results ({results.length})</h3>
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
                      const downloadAnchorNode = document.createElement('a');
                      downloadAnchorNode.setAttribute("href", dataStr);
                      downloadAnchorNode.setAttribute("download", `pharmaguard_report_${new Date().toISOString()}.json`);
                      document.body.appendChild(downloadAnchorNode);
                      downloadAnchorNode.click();
                      downloadAnchorNode.remove();
                    }}
                    className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    <FileJson className="w-4 h-4" />
                    Download All JSON
                  </button>
                </div>
                {results.map((res, index) => (
                  <ResultsDisplay key={`${res.drug}-${index}`} result={res} />
                ))}
              </>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <ActivityPlaceholder className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready for Analysis</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Upload a VCF file and enter one or more drug names (comma-separated) to generate a personalized pharmacogenomic risk assessment.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            &copy; 2024 PharmaGuard AI. For Research & Educational Use Only. Not for direct diagnostic use without clinician review.
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