import React from 'react';
import { Dna, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Dna className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-slate-900 leading-tight">PharmaGuard AI</span>
              <span className="text-xs text-slate-500 font-medium">Precision Medicine Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://cpicpgx.org/guidelines/" 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors hidden sm:block"
            >
              CPIC Guidelines
            </a>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold border border-teal-100">
              <Activity className="h-3.5 w-3.5" />
              <span>System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};