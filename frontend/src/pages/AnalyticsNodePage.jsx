import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Activity, Globe, Database, Network } from 'lucide-react';

const AnalyticsNodePage = () => {
    const [liters, setLiters] = useState(148092.4);
    
    // Simulate live data ticking
    useEffect(() => {
        const interval = setInterval(() => {
            setLiters(prev => +(prev + (Math.random() * 0.5)).toFixed(1));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 md:px-8 font-sans text-slate-300 relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto z-10 relative">
                
                {/* Header */}
                <div className="mb-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 mb-6 font-bold tracking-widest text-slate-400 text-xs shadow-inner">
                        <Database className="w-4 h-4 text-cyan-400" /> PUBLIC TRANSPARENCY LEDGER
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl">
                        Global Telemetry <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Node</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-slate-400 max-w-2xl mx-auto mt-4 leading-relaxed">
                        Hemodynamic Enterprise open metrics. Real-time data on the world's most advanced decentralized matching supply chain.
                    </motion.p>
                </div>

                {/* Massive Numbers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Liters Donated */}
                    <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        <h3 className="text-slate-400 uppercase tracking-widest text-sm font-bold flex items-center gap-2 relative"><DropletIcon /> Total Liters Routed</h3>
                        <div className="mt-4 relative font-black text-6xl md:text-8xl text-white tracking-tighter flex items-end gap-2">
                             <AnimatePresence mode="popLayout">
                                 <motion.span
                                     key={liters}
                                     initial={{ opacity: 0, y: -20 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     exit={{ opacity: 0, y: 20, position: 'absolute' }}
                                     className="drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                                 >
                                     {liters.toLocaleString()}
                                 </motion.span>
                             </AnimatePresence>
                             <span className="text-2xl text-cyan-500 mb-2">L</span>
                        </div>
                    </div>
                    
                    {/* Latency */}
                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between">
                         <h3 className="text-slate-400 uppercase tracking-widest text-sm font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-400" /> Matching Latency</h3>
                         <div className="mt-6">
                              <p className="text-5xl font-black text-white">1.4<span className="text-xl text-indigo-400 ml-1">sec</span></p>
                              <div className="mt-4 relative h-10 overflow-hidden">
                                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                                      <motion.path 
                                          d="M0,10 L10,15 L20,5 L30,20 L40,10 L50,15 L60,5 L70,10 L80,0 L90,15 L100,10" 
                                          fill="none" 
                                          stroke="#818cf8" 
                                          strokeWidth="2"
                                          initial={{ pathLength: 0 }}
                                          animate={{ pathLength: 1 }}
                                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                      />
                                  </svg>
                              </div>
                         </div>
                    </div>

                    {/* Infrastructure */}
                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between">
                         <h3 className="text-slate-400 uppercase tracking-widest text-sm font-bold flex items-center gap-2"><Network className="w-5 h-5 text-emerald-400" /> Active Nodes</h3>
                         <div className="mt-6 text-right">
                              <p className="text-5xl font-black text-white text-left">89,204</p>
                              <div className="flex items-center gap-2 mt-4">
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                  <p className="text-sm font-bold text-emerald-500 uppercase">Globally Synced</p>
                              </div>
                         </div>
                    </div>
                </div>

                {/* Sub-Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Demographics / Map Placeholder */}
                    <div className="h-80 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-[2.5rem] p-8 flex flex-col">
                        <h3 className="text-slate-400 uppercase tracking-widest text-sm font-bold flex items-center gap-2 mb-6"><Globe className="w-5 h-5 text-blue-400" /> Geographic Heatmap</h3>
                        <div className="flex-1 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-center relative shadow-inner overflow-hidden">
                             {/* Faux Map Grid */}
                             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-950"></div>
                             {/* Heat dots */}
                             <motion.div animate={{ opacity: [0.2, 1, 0.2], scale: [1, 2, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-[30%] left-[20%] w-8 h-8 bg-rose-600 rounded-full blur-xl"></motion.div>
                             <motion.div animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[60%] right-[30%] w-12 h-12 bg-rose-600 rounded-full blur-xl"></motion.div>
                             <p className="relative z-10 text-slate-500 font-bold uppercase tracking-widest text-sm">Critical Shortages: NA/EU Corridors</p>
                        </div>
                    </div>

                    {/* Types Distribution */}
                    <div className="h-80 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-[2.5rem] p-8">
                        <h3 className="text-slate-400 uppercase tracking-widest text-sm font-bold flex items-center gap-2 mb-8"><Users className="w-5 h-5 text-purple-400" /> Live Treasury Distribution</h3>
                        <div className="flex flex-col gap-4">
                            {[
                                { t: 'O+', pct: 38, color: 'bg-rose-500' },
                                { t: 'A+', pct: 34, color: 'bg-indigo-500' },
                                { t: 'O-', pct: 7, color: 'bg-cyan-500' }
                            ].map((b, i) => (
                                <div key={i} className="flex items-center gap-4">
                                     <span className="w-8 font-black text-white shrink-0">{b.t}</span>
                                     <div className="flex-1 h-4 bg-slate-950 rounded-full border border-slate-800 overflow-hidden shadow-inner">
                                         <motion.div initial={{ width: 0 }} animate={{ width: `${b.pct}%` }} transition={{ duration: 1.5, delay: i * 0.2 }} className={`h-full ${b.color} shadow-lg`} />
                                     </div>
                                     <span className="w-10 text-right text-slate-400 font-bold text-sm tracking-wider">{b.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Extracted Droplet Icon manually to avoid extra imports here
const DropletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
)

export default AnalyticsNodePage;
