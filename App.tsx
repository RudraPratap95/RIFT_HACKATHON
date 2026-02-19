import React, { useState } from 'react';
import { AnalysisResult } from './types';
import { runDetectionEngine } from './services/engine';
import { generateDemoData } from './utils/mockData';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { Radar, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const processData = async (data: any[]) => {
    setLoading(true);
    // Simulate processing delay for UI feedback
    setTimeout(() => {
      const result = runDetectionEngine(data);
      setAnalysis(result);
      setLoading(false);
    }, 800);
  };

  const handleDemoLoad = () => {
    processData(generateDemoData());
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length < 2) return;

      // Detect header to map columns
      const header = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      // Expected: transaction_id, sender_id, receiver_id, amount, timestamp
      const idxId = header.indexOf('transaction_id');
      const idxSender = header.indexOf('sender_id');
      const idxReceiver = header.indexOf('receiver_id');
      const idxAmount = header.indexOf('amount');
      const idxTime = header.indexOf('timestamp');

      const data = lines.slice(1).map((line, idx) => {
        const cols = line.split(',').map(c => c.trim());
        
        // Fallback to strict index if headers missing/malformed (as per spec strictness)
        // Spec order: transaction_id, sender_id, receiver_id, amount, timestamp
        const id = idxId > -1 ? cols[idxId] : cols[0];
        const sender = idxSender > -1 ? cols[idxSender] : cols[1];
        const receiver = idxReceiver > -1 ? cols[idxReceiver] : cols[2];
        const amount = idxAmount > -1 ? cols[idxAmount] : cols[3];
        const timestamp = idxTime > -1 ? cols[idxTime] : cols[4];

        if (!sender || !receiver || !amount) return null;

        return {
          id: id || `TX_${idx}`,
          timestamp: timestamp || new Date().toISOString(),
          sender_id: sender,
          receiver_id: receiver,
          amount: parseFloat(amount),
        };
      }).filter(x => x !== null);
      
      processData(data);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-rift-900 text-slate-200 font-sans selection:bg-rift-500 selection:text-black">
      {/* Navbar */}
      <nav className="border-b border-rift-700 bg-rift-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-rift-500 p-1.5 rounded text-rift-900">
                <Radar size={24} />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block leading-none">RIFT 2026</span>
                <span className="text-xs text-rift-400 font-mono tracking-widest uppercase">Money Mule Detection Engine</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
               <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> System Active</span>
                  <span>|</span>
                  <span className="flex items-center gap-1"><Terminal size={12}/> v2.4.0-release</span>
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysis ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
            <div className="text-center mb-8">
               <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                 Forensic Graph Intelligence
               </h1>
               <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                 Upload your transaction logs to detect circular money laundering, smurfing aggregators, and shell account networks.
               </p>
               <p className="text-sm text-rift-500 mt-2 font-mono bg-rift-900/50 inline-block px-3 py-1 rounded border border-rift-700">
                 Supports .csv: transaction_id, sender_id, receiver_id, amount, timestamp
               </p>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-rift-700 border-t-rift-500 rounded-full animate-spin"></div>
                <p className="text-rift-400 font-mono animate-pulse">ANALYZING TOPOLOGY...</p>
              </div>
            ) : (
              <FileUpload onFileUpload={handleFileUpload} onUseDemo={handleDemoLoad} />
            )}
          </div>
        ) : (
          <Dashboard data={analysis} onReset={() => setAnalysis(null)} />
        )}
      </main>
    </div>
  );
};

export default App;
