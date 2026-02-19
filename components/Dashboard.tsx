import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import GraphView from './GraphView';
import { AlertTriangle, Activity, Network, ShieldAlert, Download, Search, Clock } from 'lucide-react';

interface DashboardProps {
  data: AnalysisResult;
  onReset: () => void;
}

interface StatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, sub, icon, color }) => (
  <div className={`bg-rift-800 p-5 rounded-xl border-l-4 ${color} shadow-lg`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        <p className="text-slate-500 text-xs mt-1">{sub}</p>
      </div>
      <div className="p-2 bg-rift-900 rounded-lg border border-rift-700">
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const [filter, setFilter] = useState('');

  // Filter based on official ring report
  const filteredRings = data.report.fraud_rings.filter(ring => 
    ring.pattern_type.toLowerCase().includes(filter.toLowerCase()) || 
    ring.ring_id.toLowerCase().includes(filter.toLowerCase())
  );

  const downloadReport = () => {
    // Requirements: JSON output with specific structure
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data.report, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "forensic_report.json";
    link.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={onReset} className="text-slate-400 hover:text-white transition-colors text-sm">
          ← Upload New File
        </button>
        <div className="flex space-x-3">
          <button 
            onClick={downloadReport}
            className="flex items-center space-x-2 bg-rift-700 hover:bg-rift-600 px-4 py-2 rounded-lg text-sm font-medium border border-rift-500/30 text-rift-400"
          >
            <Download size={16} />
            <span>Export JSON Result</span>
          </button>
          <div className="bg-rift-alert/10 text-rift-alert border border-rift-alert/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-rift-alert rounded-full animate-pulse"></div>
            LIVE ANALYSIS
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Suspicion Score" 
          value={`${data.report.summary.fraud_rings_detected > 0 ? 'CRITICAL' : 'LOW'}`}
          sub="Network Risk Level"
          icon={<ShieldAlert className="text-rift-alert" />}
          color="border-rift-alert"
        />
        <StatCard 
          title="Detected Rings" 
          value={data.report.summary.fraud_rings_detected.toString()}
          sub="Confirmed Fraud Rings"
          icon={<Network className="text-rift-warn" />}
          color="border-rift-warn"
        />
        <StatCard 
          title="Suspicious Accts" 
          value={data.report.summary.suspicious_accounts_flagged.toString()}
          sub={`Out of ${data.report.summary.total_accounts_analyzed} analyzed`}
          icon={<AlertTriangle className="text-rift-400" />}
          color="border-rift-400"
        />
        <StatCard 
          title="Processing Time" 
          value={`${data.report.summary.processing_time_seconds}s`}
          sub="Execution Latency"
          icon={<Clock className="text-blue-400" />}
          color="border-blue-400"
        />
      </div>

      {/* Main Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-2">
           <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <Activity className="text-rift-500" size={20}/> 
            Topology Map
           </h2>
           <GraphView data={data} />
        </div>

        {/* Ring List Table */}
        <div className="bg-rift-800 rounded-xl border border-rift-700 flex flex-col h-[640px]">
           <div className="p-4 border-b border-rift-700 bg-rift-900/50 rounded-t-xl">
             <h3 className="text-lg font-bold text-white mb-2">Fraud Ring Summary</h3>
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter rings..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full bg-rift-900 border border-rift-700 rounded-lg py-2 pl-9 text-sm text-slate-200 focus:outline-none focus:border-rift-500"
                />
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2 space-y-2">
             {filteredRings.length === 0 ? (
                <div className="text-center text-slate-500 mt-10">No patterns match filters</div>
             ) : (
                filteredRings.map(ring => (
                  <div key={ring.ring_id} className="p-3 bg-rift-900/50 border border-rift-700 hover:border-rift-500 rounded-lg cursor-pointer transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono text-slate-400">{ring.ring_id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ring.risk_score > 90 ? 'bg-rift-alert text-black' : 'bg-rift-warn text-black'}`}>
                        SCORE: {ring.risk_score}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-200 group-hover:text-rift-400 uppercase">{ring.pattern_type.replace(/_/g, ' ')}</div>
                    
                    <div className="mt-2 text-xs text-slate-400">
                        <span className="text-slate-500">Members ({ring.member_accounts.length}):</span>
                        <div className="mt-1 font-mono text-[10px] text-slate-500 truncate">
                            {ring.member_accounts.join(', ')}
                        </div>
                    </div>
                  </div>
                ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
