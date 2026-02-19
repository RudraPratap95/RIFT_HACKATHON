import React from 'react';
import { Users, FileText, AlertCircle, PieChart, Activity, TrendingUp, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Mock data for the dashboard
  const stats = [
    { label: 'Total Analyses', value: '1,284', icon: <FileText className="w-5 h-5" />, color: 'bg-blue-500' },
    { label: 'High Risk Cases', value: '42', icon: <AlertCircle className="w-5 h-5" />, color: 'bg-rose-500' },
    { label: 'Genes Covered', value: '12', icon: <Activity className="w-5 h-5" />, color: 'bg-teal-500' },
    { label: 'Clinical Accuracy', value: '99.8%', icon: <TrendingUp className="w-5 h-5" />, color: 'bg-indigo-500' },
  ];

  const recentAnalyses = [
    { id: 'PGX-4829', gene: 'CYP2C19', drug: 'Clopidogrel', severity: 'critical', date: '2 mins ago' },
    { id: 'PGX-4828', gene: 'CYP2D6', drug: 'Tamoxifen', severity: 'moderate', date: '15 mins ago' },
    { id: 'PGX-4827', gene: 'SLCO1B1', drug: 'Simvastatin', severity: 'none', date: '1 hour ago' },
    { id: 'PGX-4826', gene: 'CYP2C9', drug: 'Warfarin', severity: 'high', date: '3 hours ago' },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'moderate': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Dashboard</h1>
          <p className="text-slate-500 font-medium">Real-time pharmacogenomic insights across your patient population.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
            Export Analytics
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">
            Schedule Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border border-white/50 relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-2.5 rounded-xl text-white shadow-lg shadow-current/20`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live</span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 glass-card rounded-3xl border border-white/50 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/30">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              Latest Diagnostic Reports
            </h3>
            <button className="text-xs font-bold text-teal-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Gene</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medication</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Level</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAnalyses.map((analysis, i) => (
                  <tr key={i} className="hover:bg-white/40 transition-colors group cursor-default">
                    <td className="px-6 py-4 font-black text-slate-900 text-sm tracking-tight">{analysis.id}</td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold font-mono border border-indigo-100 italic">
                        {analysis.gene}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">{analysis.drug}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${getSeverityBadge(analysis.severity)}`}>
                        {analysis.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-400">{analysis.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Population Trends */}
        <div className="glass-card rounded-3xl border border-white/50 p-6 flex flex-col">
          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-600" />
            Population Risks
          </h3>
          <div className="flex-grow flex flex-col justify-center gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-tight mb-1">
                <span className="text-slate-500 text-[10px]">Critical Alerts</span>
                <span className="text-rose-600 shadow-sm">3%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                <div className="bg-rose-500 h-full w-[3%] animate-pulse shadow-lg shadow-rose-500/50"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-tight mb-1">
                <span className="text-slate-500 text-[10px]">Moderate Variants</span>
                <span className="text-amber-600">22%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                <div className="bg-amber-500 h-full w-[22%] -rotate-1 shadow-lg shadow-amber-500/50"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-tight mb-1">
                <span className="text-slate-500 text-[10px]">Wild Type (WT)</span>
                <span className="text-emerald-600">75%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                <div className="bg-emerald-500 h-full w-[75%] shadow-lg shadow-emerald-500/50"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-[11px] font-bold text-indigo-700 leading-relaxed italic">
              &ldquo;Genomic distribution is consistent with 2024 global clinical cohorts.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
