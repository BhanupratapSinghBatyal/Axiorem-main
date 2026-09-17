// "use client";

// import React, { useState } from 'react';
// import { 
//   Activity, 
//   Terminal, 
//   Cpu, 
//   Layers, 
//   CheckCircle2, 
//   XCircle, 
//   Clock, 
//   ArrowUpRight, 
//   SlidersHorizontal,
//   ChevronDown,
//   Database,
//   ShieldCheck,
//   Zap,
//   TrendingUp,
//   AlertTriangle
// } from 'lucide-react';

// // FINANCIAL ENGINE & LEDGER METRICS: Track available contract pools and burn vectors
// const LEDGER_METRICS = [
//   { id: 'pool_balance', label: 'Credit Pool Balance', value: '412,850 / 500k', detail: '30-Day Cycle • Reset in 12D', status: 'nominal' },
//   { id: 'burn_rate', label: 'Estimated Exhaustion', value: '24.5 Days Remaining', detail: 'Avg 3,540 Credits / Day', status: 'nominal' },
//   { id: 'human_hours', label: 'Calculated Labor Reduction', value: '382.5 Hours Saved', detail: 'Based on Generation TTV', status: 'nominal' },
//   { id: 'compliance_pass', label: 'Audit Validation State', value: '100% Verified', detail: '0 Structural Zod Failures', status: 'nominal' },
// ];

// // REVENUE & EXPANSION TRIGGER LEDGER
// const MONTHS_POOL_USAGE = [
//   { segment: 'Mar', cost: 65, value: 38 },
//   { segment: 'Apr', cost: 80, value: 48 },
//   { segment: 'May', cost: 75, value: 62 }, 
//   { segment: 'Jun', cost: 42, value: 20 },
//   { segment: 'Jul', cost: 78, value: 52 },
//   { segment: 'Aug', cost: 60, value: 35 },
//   { segment: 'Sep', cost: 50, value: 28 },
//   { segment: 'Oct', cost: 68, value: 42 },
//   { segment: 'Nov', cost: 88, value: 64 }, 
//   { segment: 'Dec', cost: 35, value: 12 },
//   { segment: 'Jan', cost: 62, value: 38 },
//   { segment: 'Feb', cost: 72, value: 48 }
// ];

// // METRIC BREAKDOWN BY ACTION TYPE COMPLIANT WITH MANIFEST SCHEMA
// const ACTION_POOL_BREAKDOWN = [
//   { action: 'Corporate Training Deck (50cr)', volume: 184, share: 45, color: '#2563eb' },
//   { action: 'Full Compliance Assessment (30cr)', volume: 102, share: 25, color: '#3b82f6' },
//   { action: 'Executive Policy Summary (20cr)', volume: 82, share: 20, color: '#60a5fa' },
//   { action: 'SOP / Checklist Extraction (15cr)', volume: 41, share: 10, color: '#93c5fd' },
// ];

// // ALERTS FLAGS FOR ACCOUNTS EXCEEDING 80% LIMIT (SALES QUALIFIED LEAD EXPANSION)
// const EXPANSION_ALERTS = [
//   { id: 'alrt_1', title: 'Account Limit Warning (84% Over)', account: 'Logistics Core (West)', metric: 'Throttling Imminent', context: 'TRIGGER_ENTERPRISE_UPSELL' },
//   { id: 'alrt_2', title: 'Credit Exhaustion Intercept', account: 'Global Healthcare Division', metric: '0 Credits Remaining', context: 'INVOICE_PAYMENT_PAST_DUE' },
//   { id: 'alrt_3', title: 'Usage Velocity Spike', account: 'Banking Operations Group', metric: '4,200 Credits in 48H', context: 'TRIGGER_ENTERPRISE_UPSELL' },
// ];

// const RUNTIME_LEDGER_STREAM = [
//   { transaction: 'tx_9821_sop', pipeline: 'SOP / Checklist Extraction', department: 'Logistics Operations', consumer: 'm.vance@enterprise.com', cost: '15 CR', status: 'SUCCESS' },
//   { transaction: 'tx_7761_vld', pipeline: 'Full Compliance Assessment', department: 'Human Resources', consumer: 'j.doe@enterprise.com', cost: '30 CR', status: 'SUCCESS' },
//   { transaction: 'tx_4311_ppt', pipeline: 'Corporate Training Deck', department: 'Corporate Compliance', consumer: 's.allen@enterprise.com', cost: '50 CR', status: 'PENDING' },
//   { transaction: 'tx_1102_sum', pipeline: 'Executive Policy Summary', department: 'C-Suite Operations', consumer: 'c.wright@enterprise.com', cost: '20 CR', status: 'SUCCESS' },
//   { transaction: 'tx_0942_jrg', pipeline: 'Jargon Simplifier', department: 'Logistics Operations', consumer: 'k.gomez@enterprise.com', cost: '5 CR', status: 'FAILED' },
// ];

// export default function OperationsAnalytics() {
//   const [activeSegment, setActiveSegment] = useState(8); 
//   const [activeResource, setActiveResource] = useState(null);

//   let cumulativeOffset = 0;

//   return (
//     <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#212121] text-white font-sans antialiased selection:bg-[#1b365d] selection:text-white min-h-screen">
      
//       {/* CONTROL & HEADER BAR */}
//       <header className="space-y-1">
//         <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase tracking-wider">Analytics</h1>
//         <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
//           Track your operational metrics, view historical data, and monitor compliance.
//         </p>
//       </header>

//       {/* CORE FINANCIAL AND COMPLIANCE METRICS GRID */}
//       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {LEDGER_METRICS.map((metric) => (
//           <div key={metric.id} className="bg-[#3A3A3A] border border-slate-700 p-4 rounded-sm space-y-3 relative overflow-hidden">
//             <div className="flex items-center justify-between text-xs text-gray-300">
//               <span className="uppercase tracking-wider">{metric.label}</span>
//               {metric.id === 'pool_balance' && <Database className="h-3.5 w-3.5 text-blue-500" />}
//               {metric.id === 'burn_rate' && <Zap className="h-3.5 w-3.5 text-blue-500" />}
//               {metric.id === 'human_hours' && <TrendingUp className="h-3.5 w-3.5 text-blue-500" />}
//               {metric.id === 'compliance_pass' && <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />}
//             </div>
//             <div className="space-y-1">
//               <h2 className="text-xl font-bold tracking-tight text-white font-sans">{metric.value}</h2>
//               <p className="text-[11px] text-gray-300 uppercase">{metric.detail}</p>
//             </div>
//             <div className="absolute bottom-0 inset-x-0 h-[2px] bg-blue-500/20" />
//           </div>
//         ))}
//       </section>

//       {/* TIME-SERIES BURN CORRELATION & SCHEDULER SEGMENTATION */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Credit Pool Burn Allocation Over Time */}
//         <section className="lg:col-span-2 bg-[#3A3A3A] border border-slate-700 p-5 rounded-sm flex flex-col justify-between space-y-6">
//           <div className="space-y-1">
//             <span className="text-[10px] text-gray-300 tracking-widest uppercase block">Resource Accounting</span>
//             <h3 className="text-xs font-bold text-white uppercase">Historical Credit Consumption Timeline</h3>
//           </div>

//           <div className="flex items-center gap-4 text-[10px] text-gray-300 uppercase tracking-wider">
//             <div className="flex items-center gap-1.5">
//               <span className="w-2 h-2 bg-blue-600 rounded-sm" />
//               <span>Credits Consumed</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <span className="w-2 h-2 bg-blue-300 rounded-sm" />
//               <span>LMS Sync Webhooks Logged</span>
//             </div>
//           </div>

//           {/* Matrix Coordinate Area */}
//           <div className="h-48 w-full flex flex-col justify-between pt-2 select-none">
//             <div className="flex-1 w-full flex items-end justify-between gap-2 relative border-b border-slate-700">
//               <div className="absolute inset-x-0 top-0 border-t border-slate-700 text-[9px] text-gray-300 pt-0.5 pointer-events-none">100k CREDITS</div>
//               <div className="absolute inset-x-0 top-1/4 border-t border-slate-700 text-[9px] text-gray-300 pt-0.5 pointer-events-none">75k CREDITS</div>
//               <div className="absolute inset-x-0 top-1/2 border-t border-slate-700 text-[9px] text-gray-300 pt-0.5 pointer-events-none">50k CREDITS</div>
//               <div className="absolute inset-x-0 top-3/4 border-t border-slate-700 text-[9px] text-gray-300 pt-0.5 pointer-events-none">25k CREDITS</div>

//               {MONTHS_POOL_USAGE.map((bar, idx) => {
//                 const isActive = activeSegment === idx;
//                 return (
//                   <div 
//                     key={idx} 
//                     onMouseEnter={() => setActiveSegment(idx)}
//                     className={`flex-1 flex items-end justify-center gap-[2px] h-full max-w-[32px] cursor-pointer p-0.5 transition-colors ${
//                       isActive ? 'bg-[#222222]' : 'bg-transparent'
//                     }`}
//                   >
//                     <div 
//                       style={{ height: `${(bar.cost / 100) * 100}%` }} 
//                       className={`w-full bg-blue-600 transition-all duration-500 ${isActive ? 'brightness-110' : 'opacity-80'}`}
//                     />
//                     <div 
//                       style={{ height: `${(bar.value / 100) * 100}%` }} 
//                       className={`w-full bg-blue-300 transition-all duration-500 ${isActive ? 'brightness-110' : 'opacity-80'}`}
//                     />
//                   </div>
//                 );
//               })}
//             </div>

//             {/* X-Axis Month Array */}
//             <div className="flex justify-between items-center pt-2 text-[9px] text-[#666666] uppercase tracking-wider">
//               {MONTHS_POOL_USAGE.map((item, i) => (
//                 <span 
//                   key={i} 
//                   className={`flex-1 text-center transition-colors ${activeSegment === i ? 'text-white font-bold' : ''}`}
//                 >
//                   {item.segment}
//                 </span>
//               ))}
//             </div>
//           </div>
          
//           {/* Active Month Status Block */}
//           <div className="bg-[#141414] border border-[#282828] p-3 grid grid-cols-3 gap-4 text-xs">
//             <div>
//               <span className="text-[#666666] block uppercase text-[10px]">LEDGER PERIOD</span>
//               <span className="text-white font-bold">{MONTHS_POOL_USAGE[activeSegment].segment} 2026</span>
//             </div>
//             <div>
//               <span className="text-[#666666] block uppercase text-[10px]">TOTAL BURNED</span>
//               <span className="text-blue-400 font-bold font-sans">{(MONTHS_POOL_USAGE[activeSegment].cost * 1000).toLocaleString()} CR</span>
//             </div>
//             <div>
//               <span className="text-[#666666] block uppercase text-[10px]">SCORM SYSTEM SYNCS</span>
//               <span className="text-blue-200 font-bold font-sans">{(MONTHS_POOL_USAGE[activeSegment].value * 10).toLocaleString()} LOGS</span>
//             </div>
//           </div>
//         </section>

//         {/* Action Type Apportionment Module */}
//         <section className="bg-[#1a1a1a] border border-[#282828] p-5 rounded-sm flex flex-col justify-between space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="space-y-1">
//               <span className="text-[10px] text-[#888888] tracking-widest uppercase block">Computation Mix</span>
//               <h4 className="text-xs font-bold text-white uppercase">Action Cost Distribution</h4>
//             </div>
//           </div>

//           {/* SVG Allocation Circle */}
//           <div className="flex justify-center items-center py-2">
//             <div className="relative w-36 h-36 flex items-center justify-center">
//               <svg className="w-full h-full transform -rotate-90 select-none" viewBox="0 0 36 36">
//                 <circle cx="18" cy="18" r="15.915" fill="none" stroke="#222222" strokeWidth="2.5" />
//                 {ACTION_POOL_BREAKDOWN.map((sys, idx) => {
//                   const dashArray = `${sys.share} ${100 - sys.share}`;
//                   const dashOffset = -cumulativeOffset;
//                   cumulativeOffset += sys.share;
//                   const isActive = activeResource === idx;

//                   return (
//                     <circle
//                       key={idx}
//                       cx="18"
//                       cy="18"
//                       r="15.915"
//                       fill="none"
//                       stroke={sys.color}
//                       strokeWidth={isActive ? "3.5" : "2.5"}
//                       strokeDasharray={dashArray}
//                       strokeDashoffset={dashOffset}
//                       className="cursor-pointer transition-all duration-150"
//                       onMouseEnter={() => setActiveResource(idx)}
//                       onMouseLeave={() => setActiveResource(null)}
//                     />
//                   );
//                 })}
//               </svg>

//               <div className="absolute flex flex-col items-center text-center pointer-events-none px-2 uppercase">
//                 <span className="text-[9px] text-[#666666] truncate max-w-[100px]">
//                   {activeResource !== null ? 'EXECUTIONS' : 'TOTAL UNITS'}
//                 </span>
//                 <span className="text-lg font-bold text-white font-sans tracking-tight">
//                   {activeResource !== null ? ACTION_POOL_BREAKDOWN[activeResource].volume : '409'}
//                 </span>
//                 {activeResource !== null && (
//                   <span className="text-[10px] text-blue-400 font-bold">
//                     {ACTION_POOL_BREAKDOWN[activeResource].share}%
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="space-y-1">
//             {ACTION_POOL_BREAKDOWN.map((sys, idx) => {
//               const isActive = activeResource === idx;
//               return (
//                 <div 
//                   key={idx} 
//                   onMouseEnter={() => setActiveResource(idx)}
//                   onMouseLeave={() => setActiveResource(null)}
//                   className={`flex items-center justify-between text-[11px] p-2 rounded-sm transition-colors cursor-pointer ${
//                     isActive ? 'bg-[#222222]' : 'bg-transparent'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2 truncate">
//                     <span style={{ backgroundColor: sys.color }} className="w-2 h-2 rounded-sm shrink-0" />
//                     <span className={isActive ? 'text-white font-bold' : 'text-[#aaaaaa]'}>
//                       {sys.action}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-3 font-sans shrink-0 ml-2">
//                     <span className="text-[#555555] text-[10px]">{sys.volume} ops</span>
//                     <span className="text-white w-8 text-right font-bold">{sys.share}%</span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>
//       </div>

//       {/* EXPANSION SIGNALS & REVENUE INTELLIGENCE STREAM */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         {/* Sales Qualified Lead Triggers (Credit Throttling Intercepts) */}
//         <section className="bg-[#1a1a1a] border border-[#282828] p-5 rounded-sm flex flex-col space-y-4">
//           <div className="space-y-1">
//             <span className="text-[10px] text-amber-500 tracking-widest uppercase block flex items-center gap-1.5">
//               <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
//               <span>Expansion Intercepts (80% Threshold Logs)</span>
//             </span>
//             <h4 className="text-xs font-bold text-white uppercase">SQL Account Monetization Signals</h4>
//           </div>

//           <div className="flex-1 divide-y divide-[#222222]">
//             {EXPANSION_ALERTS.map((alrt) => (
//               <div key={alrt.id} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0 text-xs">
//                 <div className="flex items-center gap-3 truncate">
//                   <div className="space-y-0.5 truncate">
//                     <h5 className="font-bold text-white truncate uppercase tracking-tight">{alrt.account}</h5>
//                     <p className="text-[10px] text-amber-400 font-bold truncate uppercase">{alrt.title} • {alrt.metric}</p>
//                   </div>
//                 </div>
//                 <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#221c11] border border-amber-900/50 text-amber-400 font-bold shrink-0">
//                   {alrt.context}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Internal Performance Mapping */}
//         <section className="bg-[#1a1a1a] border border-[#282828] p-5 rounded-sm flex flex-col space-y-4">
//           <div className="space-y-1">
//             <span className="text-[10px] text-[#888888] tracking-widest uppercase block">Data Density Mapping</span>
//             <h4 className="text-xs font-bold text-white uppercase">Corporate Document Pipeline Volume</h4>
//           </div>

//           <div className="flex-1 flex flex-col justify-between gap-4">
//             {[
//               { label: 'OSHA / Regulatory Handbooks Parsed', metric: '1,420 pages', pct: 85 },
//               { label: 'Internal SOP Manuals Ingested', metric: '890 pages', pct: 60 },
//               { label: 'C-Suite Strategy Briefs Extracted', metric: '410 pages', pct: 40 }
//             ].map((sub, idx) => (
//               <div key={idx} className="space-y-2 text-xs">
//                 <div className="flex justify-between items-start gap-4">
//                   <div className="space-y-0.5">
//                     <h5 className="font-bold text-white uppercase tracking-tight">{sub.label}</h5>
//                     <span className="block text-[10px] text-[#666666] uppercase">{sub.metric}</span>
//                   </div>
//                   <span className="text-[#aaaaaa] text-[11px] font-bold font-sans">{sub.pct}% VOL</span>
//                 </div>
                
//                 <div className="w-full h-1 bg-[#222222] rounded-full overflow-hidden relative">
//                   <div 
//                     style={{ width: `${sub.pct}%` }}
//                     className="h-full bg-blue-500 transition-all duration-500"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>

//       {/* USER CONSUMPTION LEDGER STREAM */}
//       <footer className="w-full bg-[#1a1a1a] border border-[#282828] p-5 space-y-4 overflow-hidden rounded-sm">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//           <div className="space-y-1">
//             <span className="text-[10px] text-[#888888] tracking-widest uppercase block">Universal Accounting Logs</span>
//             <h3 className="text-xs font-bold text-white uppercase">Real-time Credit Ledger Ledger Stream</h3>
//           </div>
//         </div>

//         {/* Headers */}
//         <div className="hidden lg:grid grid-cols-6 gap-4 pt-2 border-b border-[#282828] text-[10px] text-[#666666] uppercase pb-2">
//           <div>Transaction ID</div>
//           <div>Computational Core Action</div>
//           <div>Target Org Department</div>
//           <div>System Authorized Key</div>
//           <div>Asset Cost</div>
//           <div className="text-right font-sans">API Protocol Status</div>
//         </div>
        
//         {/* Rows */}
//         <div className="divide-y divide-[#222222] border-t lg:border-t-0 border-[#282828]">
//           {RUNTIME_LEDGER_STREAM.map((row, index) => (
//             <div key={index} className="flex flex-col lg:grid lg:grid-cols-6 gap-2 lg:gap-4 py-3 text-xs text-[#aaaaaa]">
              
//               <div className="flex items-center justify-between lg:block">
//                 <div className="text-white font-bold">{row.transaction}</div>
//                 <div className="lg:hidden">
//                   <span className={`inline-flex items-center px-2 py-0.5 text-[9px] border font-bold rounded-sm ${
//                     row.status === 'SUCCESS' ? 'border-emerald-900 bg-emerald-950/50 text-emerald-400' : row.status === 'PENDING' ? 'border-amber-900 bg-amber-950/50 text-amber-400' : 'border-rose-900 bg-rose-950/50 text-rose-400'
//                   }`}>
//                     {row.status}
//                   </span>
//                 </div>
//               </div>

//               <div className="text-slate-300 font-semibold truncate">
//                 <span className="lg:hidden text-[10px] text-[#555555] mr-1.5 uppercase">ACTION:</span>
//                 {row.pipeline}
//               </div>
              
//               <div className="text-[#888888] truncate">
//                 <span className="lg:hidden text-[10px] text-[#555555] mr-1.5 uppercase">DEPT:</span>
//                 {row.department}
//               </div>

//               <div className="text-[#666666] truncate font-sans">
//                 <span className="lg:hidden text-[10px] text-[#555555] mr-1.5 uppercase">AUTH KEY:</span>
//                 {row.consumer}
//               </div>
              
//               <div className="text-white font-bold font-sans flex items-center justify-between lg:block">
//                 <div>
//                   <span className="lg:hidden text-[10px] text-[#555555] mr-1.5 uppercase">COST:</span>
//                   {row.cost}
//                 </div>
//                 <div className="lg:hidden">
//                   <button className="flex items-center gap-1 text-blue-400 font-bold text-[10px] uppercase font-mono">
//                     View Payload <ArrowUpRight className="w-3 h-3" />
//                   </button>
//                 </div>
//               </div>
              
//               <div className="hidden lg:flex items-center justify-end font-sans">
//                 <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 border rounded-sm ${
//                   row.status === 'SUCCESS' ? 'border-emerald-900/50 bg-emerald-950/30 text-emerald-400' : row.status === 'PENDING' ? 'border-amber-900/50 bg-amber-950/30 text-amber-400' : 'border-rose-900/50 bg-rose-950/30 text-rose-400'
//                 }`}>
//                   {row.status === 'SUCCESS' && <span className="w-1 h-1 rounded-full bg-emerald-400" />}
//                   {row.status === 'FAILED' && <span className="w-1 h-1 rounded-full bg-rose-400" />}
//                   {row.status === 'PENDING' && <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />}
//                   {row.status}
//                 </span>
//               </div>

//             </div>
//           ))}
//         </div>
//       </footer>

//     </div>
//   );
// }




// app/dashboard/analytics/page.jsx

"use client";

import DashboardHome from "../page";

export default function AnalyticsPage() {
  return <DashboardHome defaultAnalyticsOpen={true} />;
}