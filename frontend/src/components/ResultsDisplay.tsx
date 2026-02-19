import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, XCircle, AlertOctagon, Info, FileJson, Copy, ChevronDown, ChevronUp, Beaker, ExternalLink, Download } from 'lucide-react';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const [showJson, setShowJson] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'none': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'low': return 'bg-cyan-50 text-cyan-700 border-cyan-200 ring-cyan-500/20';
      case 'moderate': return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20';
      case 'critical': return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20';
    }
  };

  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case 'none': return <CheckCircle className="w-6 h-6 text-emerald-500" />;
      case 'low': return <Info className="w-6 h-6 text-cyan-500" />;
      case 'moderate': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'high': return <AlertOctagon className="w-6 h-6 text-orange-500" />;
      case 'critical': return <XCircle className="w-6 h-6 text-rose-500" />;
      default: return <Info className="w-6 h-6 text-slate-500" />;
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Top Summary Card */}
      <div className="glass-card rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-white/40 bg-white/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-teal-500 p-3 rounded-xl shadow-lg shadow-teal-500/20">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-left">
                  {result.drug}
                  <span className="ml-2 text-slate-400 font-medium text-lg italic">Analysis Report</span>
                </h2>
                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                  <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold tracking-tight">{result.patient_id}</span>
                  <span className="opacity-30">•</span>
                  <span className="font-medium">{new Date(result.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>
            </div>

            <div className={`px-5 py-3 rounded-2xl border-2 ring-4 shadow-sm flex items-center gap-4 transition-all hover:scale-105 ${getRiskColor(result.risk_assessment.severity)}`}>
              <div className="p-2 bg-white rounded-full shadow-inner animate-pulse">
                {getRiskIcon(result.risk_assessment.severity)}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Risk Result</span>
                <span className="text-xl font-black leading-none uppercase tracking-tight">{result.risk_assessment.risk_label}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/20">
          {/* Clinical Recommendation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-teal-100 p-1.5 rounded-lg">
                <CheckCircle className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Clinical Action</h3>
            </div>
            <div className="bg-white/60 border border-white/80 rounded-2xl p-6 shadow-sm ring-1 ring-slate-100/50 h-full">
              <p className="text-slate-900 font-semibold text-lg leading-snug">
                {result.clinical_recommendation.action}
              </p>
              {result.clinical_recommendation.alternative_drugs && result.clinical_recommendation.alternative_drugs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase w-full mb-1 tracking-tight">Recommended Alternatives</span>
                  {result.clinical_recommendation.alternative_drugs.map((alt, i) => (
                    <span key={i} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold border border-teal-100 italic">
                      {alt}
                    </span>
                  ))}
                </div>
              )}
              {result.clinical_recommendation.cpic_guideline && (
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-teal-600 font-bold uppercase tracking-wider bg-teal-50/50 w-fit px-2 py-0.5 rounded border border-teal-100">
                  <ExternalLink className="w-3 h-3" />
                  {result.clinical_recommendation.cpic_guideline}
                </div>
              )}
            </div>
          </div>

          {/* Genetic Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-100 p-1.5 rounded-lg">
                <Dna className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Genomic Profile</h3>
            </div>
            <div className="bg-white/60 border border-white/80 rounded-2xl p-6 shadow-sm ring-1 ring-slate-100/50 h-full">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Target Gene</p>
                  <p className="text-2xl font-black text-indigo-900 leading-tight flex items-baseline gap-1">
                    {result.pharmacogenomic_profile.primary_gene}
                    <span className="text-xs font-mono font-medium text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {result.pharmacogenomic_profile.diplotype}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Phenotype</p>
                  <p className="text-2xl font-black text-indigo-900 truncate" title={result.pharmacogenomic_profile.phenotype}>
                    {result.pharmacogenomic_profile.phenotype}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-3">Detected Variants</p>
                  <div className="flex flex-wrap gap-2">
                    {result.pharmacogenomic_profile.detected_variants.length > 0 ? (
                      result.pharmacogenomic_profile.detected_variants.map((v, idx) => (
                        <div key={idx} className="group relative bg-white border border-indigo-100 text-indigo-600 px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-sm hover:ring-2 hover:ring-indigo-400 transition-all cursor-default">
                          <span className="text-indigo-400 mr-1">rs</span>{v.rsid.replace('rs', '')}
                          {v.star_allele && <span className="ml-2 bg-indigo-600 text-white px-1.5 py-0.5 rounded text-[9px] uppercase font-black">{v.star_allele}</span>}
                        </div>
                      ))
                    ) : (
                      <div className="text-[12px] text-slate-400 italic bg-slate-50 border border-dashed border-slate-200 rounded-xl px-4 py-3 w-full text-center">
                        No high-impact variants detected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Accordion */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-5 bg-white/40 hover:bg-white/60 transition-all"
        >
          <span className="font-bold text-slate-800 flex items-center gap-3">
            <div className="bg-slate-800 p-1.5 rounded-lg shadow-inner">
              <Info className="w-5 h-5 text-teal-400" />
            </div>
            Clinical Insights & Biological Mechanism
          </span>
          <div className="bg-slate-200/50 p-1 rounded-full">
            {showDetails ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
          </div>
        </button>

        {showDetails && (
          <div className="p-8 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left bg-white/10">
            <div className="relative pl-6 border-l-4 border-teal-500">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Clinical Summary</h4>
              <p className="text-slate-700 leading-relaxed text-sm font-medium">{result.llm_generated_explanation.summary}</p>
            </div>
            <div className="relative pl-6 border-l-4 border-blue-500">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Molecular Mechanism</h4>
              <p className="text-slate-700 leading-relaxed text-sm font-medium">
                {result.llm_generated_explanation.mechanism}
              </p>
            </div>
            <div className="relative pl-6 border-l-4 border-amber-500">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Implications</h4>
              <p className="text-slate-700 leading-relaxed text-sm font-medium">
                {result.llm_generated_explanation.clinical_implications}
              </p>
            </div>

            {result.llm_generated_explanation.citations && result.llm_generated_explanation.citations.length > 0 && (
              <div className="col-span-full pt-6 border-t border-slate-100 flex items-start gap-4">
                <span className="text-[10px] font-black text-slate-300 uppercase rotate-90 origin-left translate-y-6">Citations</span>
                <div className="flex flex-wrap gap-3">
                  {result.llm_generated_explanation.citations.map((cite, i) => (
                    <span key={i} className="text-[11px] font-bold text-slate-500 bg-slate-100/50 px-3 py-1 rounded-lg border border-slate-200">
                      [{i + 1}] {cite}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* JSON Viewer */}
      <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
        <button
          onClick={() => setShowJson(!showJson)}
          className="w-full flex items-center justify-between p-5 bg-slate-800/50 hover:bg-slate-800 transition-all border-b border-white/5"
        >
          <span className="font-bold text-slate-300 flex items-center gap-3">
            <FileJson className="w-5 h-5 text-teal-500" />
            Machine-Readable Output
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 group-hover:border-teal-500 transition-colors">SCHEMA v4.2</span>
            <div className="bg-slate-700/50 p-1 rounded-full">
              {showJson ? <ChevronUp className="w-5 h-5 text-teal-400" /> : <ChevronDown className="w-5 h-5 text-teal-400" />}
            </div>
          </div>
        </button>

        {showJson && (
          <div className="relative group">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={handleCopyJson}
                className="p-2.5 bg-slate-800 hover:bg-teal-600 rounded-xl text-slate-300 hover:text-white transition-all shadow-lg border border-slate-700"
                title="Copy to Clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute("download", `pharmaguard_report_${result.drug}.json`);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                }}
                className="p-2.5 bg-slate-800 hover:bg-teal-600 rounded-xl text-slate-300 hover:text-white transition-all shadow-lg border border-slate-700"
                title="Download JSON"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <pre className="p-8 pb-10 overflow-x-auto text-[11px] font-mono text-teal-400 leading-6 bg-slate-950/50 text-left">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

function Dna({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 15c6.667-6 13.333 0 20-6" />
      <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
      <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
      <path d="M17 6l-2.5-2.5" />
      <path d="M14 8l-1-1" />
      <path d="M7 18l2.5 2.5" />
      <path d="M3.5 14.5l.5.5" />
      <path d="M20 9l.5.5" />
      <path d="M6.5 12.5l1 1" />
      <path d="M16.5 10.5l1 1" />
      <path d="M10 16l-1 1" />
    </svg>
  );
}