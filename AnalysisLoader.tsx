import React, { useState, useEffect } from 'react';

const STEPS = [
  { label: 'Validating VCF format',         icon: '📄', duration: 700  },
  { label: 'Parsing genomic variants',       icon: '🧬', duration: 900  },
  { label: 'Matching variant database',      icon: '🔍', duration: 800  },
  { label: 'Building diplotype profiles',    icon: '🧩', duration: 700  },
  { label: 'Running CPIC risk assessment',   icon: '⚠️', duration: 1000 },
  { label: 'Generating clinical explanation',icon: '🤖', duration: 1200 },
  { label: 'Compiling report',               icon: '📋', duration: 500  },
];

export const AnalysisLoader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [doneSteps, setDoneSteps]     = useState<number[]>([]);

  useEffect(() => {
    let step = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const advance = () => {
      if (step >= STEPS.length) {
        onComplete?.();
        return;
      }
      timeout = setTimeout(() => {
        setDoneSteps(prev => [...prev, step]);
        step++;
        setCurrentStep(step);
        advance();
      }, STEPS[step]?.duration || 800);
    };

    advance();
    return () => clearTimeout(timeout);
  }, [onComplete]);

  const pct = Math.round((doneSteps.length / STEPS.length) * 100);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 space-y-8">

      {/* DNA spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-teal-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-500 animate-spin"
             style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🧬</div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Analyzing Genome</h3>
        <p className="text-sm text-slate-500 font-medium mt-1">CPIC-aligned pharmacogenomic assessment in progress</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div className="w-full max-w-sm space-y-2">
        {STEPS.map((step, i) => {
          const isDone    = doneSteps.includes(i);
          const isActive  = currentStep === i;
          const isPending = !isDone && !isActive;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-400 ${
                isDone
                  ? 'bg-teal-50 border-teal-100'
                  : isActive
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white border-slate-100 opacity-40'
              }`}
            >
              {/* Status icon */}
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                isDone   ? 'bg-teal-500' :
                isActive ? 'bg-blue-500 animate-pulse' :
                           'bg-slate-200'
              }`}>
                {isDone ? (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                )}
              </div>

              <span className={`text-xs font-bold ${
                isDone   ? 'text-teal-700' :
                isActive ? 'text-blue-700' :
                           'text-slate-400'
              }`}>
                {step.icon} {step.label}
              </span>

              {isActive && (
                <span className="ml-auto text-[9px] font-black text-blue-500 uppercase tracking-widest animate-pulse">
                  Running...
                </span>
              )}
              {isDone && (
                <span className="ml-auto text-[9px] font-black text-teal-500 uppercase tracking-widest">
                  Done
                </span>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default AnalysisLoader;
