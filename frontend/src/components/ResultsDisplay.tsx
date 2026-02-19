import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { AlertTriangle, CheckCircle, XCircle, AlertOctagon, Info, FileJson, Copy, ChevronDown, ChevronUp, Beaker } from 'lucide-react';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const [showJson, setShowJson] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'none': return 'bg-green-100 text-green-800 border-green-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case 'none': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'low': return <Info className="w-6 h-6 text-blue-600" />;
      case 'moderate': return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'high': return <AlertOctagon className="w-6 h-6 text-orange-600" />;
      case 'critical': return <XCircle className="w-6 h-6 text-red-600" />;
      default: return <Info className="w-6 h-6 text-slate-600" />;
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    // Could add toast here
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Beaker className="w-6 h-6 text-teal-600" />
                {result.drug} Analysis
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Patient ID: {result.patient_id} • {new Date(result.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${getRiskColor(result.risk_assessment.severity)}`}>
              {getRiskIcon(result.risk_assessment.severity)}
              <div className="flex flex-col">
                <span className="text-xs uppercase font-bold opacity-80">Risk Level</span>
                <span className="text-lg font-bold leading-none capitalize">{result.risk_assessment.risk_label}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Clinical Recommendation */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-600" /> Clinical Recommendation
            </h3>
            <div className="bg-teal-50 border border-teal-100 rounded-lg p-4">
              <p className="text-slate-800 font-medium leading-relaxed">
                {result.clinical_recommendation.action || result.clinical_recommendation.dosing_guidance}
              </p>
              {result.clinical_recommendation.alternative_drugs && result.clinical_recommendation.alternative_drugs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-teal-100">
                  <span className="text-xs font-semibold text-teal-800 uppercase">Alternatives: </span>
                  <span className="text-sm text-teal-900">
                    {result.clinical_recommendation.alternative_drugs.join(", ")}
                  </span>
                </div>
              )}
              {result.clinical_recommendation.cpic_guideline && (
                <div className="mt-2 text-xs text-teal-600 font-medium">
                  Ref: {result.clinical_recommendation.cpic_guideline}
                </div>
              )}
            </div>
          </div>

          {/* Genetic Profile */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Dna className="w-4 h-4 text-indigo-600" /> Genetic Profile
            </h3>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-indigo-500 font-semibold uppercase">Gene</p>
                  <p className="text-lg font-bold text-indigo-900 leading-tight">
                    {result.pharmacogenomic_profile.primary_gene}
                    <span className="block text-xs font-mono font-normal opacity-70 mt-0.5">
                      {result.pharmacogenomic_profile.diplotype}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-indigo-500 font-semibold uppercase">Phenotype</p>
                  <p className="text-lg font-bold text-indigo-900">{result.pharmacogenomic_profile.phenotype}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-indigo-500 font-semibold uppercase mb-2">Detected Variants ({result.pharmacogenomic_profile.detected_variants.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.pharmacogenomic_profile.detected_variants.length > 0 ? (
                      result.pharmacogenomic_profile.detected_variants.map((v, idx) => (
                        <div key={idx} className="group relative bg-white border border-indigo-200 text-indigo-700 px-2 py-1 rounded text-[10px] font-mono hover:bg-indigo-600 hover:text-white transition-all">
                          {v.rsid} {v.star_allele ? `(${v.star_allele})` : ''}
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-indigo-400 italic">No specific variants detected (Wild Type presumed)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Accordion */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <span className="font-semibold text-slate-700 flex items-center gap-2">
            <Info className="w-5 h-5 text-slate-500" />
            Clinical Insights & Biological Mechanism
          </span>
          {showDetails ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {showDetails && (
          <div className="p-6 border-t border-slate-200 space-y-6">
            <div className="flex gap-4">
              <div className="w-1 bg-teal-500 rounded-full shrink-0"></div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Clinical Summary</h4>
                <p className="text-slate-600 leading-relaxed text-sm">{result.llm_generated_explanation.summary}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-blue-500 rounded-full shrink-0"></div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Biological Mechanism</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {result.llm_generated_explanation.mechanism || result.llm_generated_explanation.biological_mechanism}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-amber-500 rounded-full shrink-0"></div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Clinical Implications</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {result.llm_generated_explanation.clinical_implications || "Standard clinical monitoring recommended."}
                </p>
              </div>
            </div>
            {result.llm_generated_explanation.citations && result.llm_generated_explanation.citations.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-tight">References</h4>
                <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-1">
                  {result.llm_generated_explanation.citations.map((cite, i) => (
                    <li key={i}>{cite}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* JSON Viewer */}
      <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
        <button
          onClick={() => setShowJson(!showJson)}
          className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            <FileJson className="w-5 h-5 text-teal-400" />
            Raw JSON Output
          </span>
          {showJson ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {showJson && (
          <div className="relative">
            <button
              onClick={handleCopyJson}
              className="absolute top-4 right-4 p-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
              title="Copy to Clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            <pre className="p-6 overflow-x-auto text-xs font-mono text-teal-50 leading-5">
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