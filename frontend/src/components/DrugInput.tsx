import React from 'react';
import { Pill } from 'lucide-react';
import { EXAMPLE_DRUGS } from '../types';

interface DrugInputProps {
  drug: string;
  setDrug: (drug: string) => void;
}

export const DrugInput: React.FC<DrugInputProps> = ({ drug, setDrug }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Target Medication
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Pill className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={drug}
          onChange={(e) => setDrug(e.target.value)}
          placeholder="e.g. Warfarin, Clopidogrel (comma separated)..."
          className="pl-10 block w-full rounded-lg border border-slate-300 py-2.5 text-slate-900 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
        />
      </div>

      <div className="mt-3">
        <p className="text-xs text-slate-500 mb-2 font-medium">Common Pharmacogenomic Drugs (Click to Add):</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_DRUGS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                const currentDrugs = drug.split(',').map(item => item.trim()).filter(item => item.length > 0);
                if (!currentDrugs.includes(d)) {
                  setDrug(currentDrugs.length > 0 ? `${currentDrugs.join(', ')}, ${d}` : d);
                }
              }}
              className={`
                px-2.5 py-1 rounded-md text-xs font-medium transition-colors border
                ${drug.toUpperCase().includes(d)
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-700'}
              `}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};