import React, { useState } from 'react';
import { Dna, Activity, Menu, X, ChevronRight, LayoutDashboard, Microscope } from 'lucide-react';

interface HeaderProps {
  currentView: 'analysis' | 'dashboard';
  setCurrentView: (view: 'analysis' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNav = (view: 'analysis' | 'dashboard') => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="glass-card sticky top-0 z-[100] border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center gap-3 sm:gap-4 group cursor-pointer"
            onClick={() => handleNav('analysis')}
          >
            <div className="bg-teal-600 p-2 sm:p-2.5 rounded-xl shadow-lg shadow-teal-600/20 transform group-hover:rotate-12 transition-transform duration-300">
              <Dna className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl sm:text-2xl text-slate-900 leading-tight tracking-tight">
                Pharma<span className="text-teal-600">Guard</span>
                <span className="ml-0.5 text-slate-400 font-medium text-lg">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-100 w-fit px-1.5 py-0.5 rounded mt-0.5">
                Precision PGx Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200 shadow-inner">
              <button
                onClick={() => handleNav('analysis')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-tight rounded-xl transition-all ${currentView === 'analysis' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Diagnostic
              </button>
              <button
                onClick={() => handleNav('dashboard')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-tight rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Dashboard
              </button>
            </nav>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black border border-emerald-100 shadow-sm">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              <span>API ONLINE</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all border border-transparent hover:border-teal-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] md:hidden animate-fade-in"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Sidebar Content */}
      <div className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[100] md:hidden shadow-2xl transition-transform duration-300 ease-out border-l border-slate-100 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <span className="font-black text-xl text-slate-900">Navigation</span>
            <button onClick={toggleMenu} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-2">
            <button
              onClick={() => handleNav('analysis')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${currentView === 'analysis' ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <Microscope className={`h-5 w-5 ${currentView === 'analysis' ? 'text-teal-600' : 'text-slate-400'}`} />
                <span className="font-bold">Genomic Diagnostic</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </button>

            <button
              onClick={() => handleNav('dashboard')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${currentView === 'dashboard' ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`h-5 w-5 ${currentView === 'dashboard' ? 'text-teal-600' : 'text-slate-400'}`} />
                <span className="font-bold">Medical Dashboard</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </button>
          </div>

          <div className="mt-auto p-6 border-t border-slate-100">
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">System Operational</span>
            </div>
            <p className="mt-4 text-[10px] text-slate-400 font-medium text-center uppercase tracking-tighter">
              PharmaGuard v1.1 • RIFT 2026 Hackathon
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};