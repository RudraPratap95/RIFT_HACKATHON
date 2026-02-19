import React from 'react';
import { Dna, Activity, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="glass-card sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="bg-teal-600 p-2.5 rounded-xl shadow-lg shadow-teal-600/20 transform group-hover:rotate-12 transition-transform duration-300">
              <Dna className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl text-slate-900 leading-tight tracking-tight">
                Pharma<span className="text-teal-600">Guard</span>
                <span className="ml-1 text-slate-400 font-medium">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-100 w-fit px-1.5 py-0.5 rounded mt-0.5">
                Precision PGx Platform
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-6">
              <a href="#" className="text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors">Dashboard</a>
              <a href="https://cpicpgx.org/" target="_blank" className="text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors">Guidelines</a>
              <a href="#" className="text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors">Resources</a>
            </nav>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black border border-emerald-100 shadow-sm">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                <span>API ONLINE</span>
              </div>
              <div className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-teal-600 cursor-pointer transition-colors">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};