import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Snowflake, ThermometerSnowflake, Activity, Timer } from 'lucide-react';
import { apiFetch } from '../utils/api';

const OrganNodePage = () => {
    const [tick, setTick] = useState(0);
    const [organs, setOrgans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulated live tick for visual heartbeat sync effect
    useEffect(() => {
        const interval = setInterval(() => setTick(prev => prev + 1), 60000);
        return () => clearInterval(interval);
    }, []);

    // Phase 1: Fetch live active organ logistics from Hemodynamic Backend
    useEffect(() => {
        const fetchOrgans = async () => {
            try {
                const response = await apiFetch('/api/premium/active-organs');
                if (!response.ok) throw new Error('Failed to sync with grid');
                const data = await response.json();
                setOrgans(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrgans();
        
        // Setup polling every 10 seconds to keep grid live
        const poll = setInterval(fetchOrgans, 10000);
        return () => clearInterval(poll);
    }, []);

    // Phase 2: Helper calculating raw backend timestamp limits into UX percentage bars
    const calculateMetrics = (collectedStr, deadlineStr) => {
        const collected = new Date(collectedStr).getTime();
        const deadline = new Date(deadlineStr).getTime();
        const now = new Date().getTime(); // Assuming backend and frontend TZ align or using UTC natively

        const totalMs = deadline - collected;
        const remainingMs = deadline - now;

        const formatHM = (ms) => {
            if (ms <= 0) return '0H 0M';
            const h = Math.floor(ms / (1000 * 60 * 60));
            const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
            return `${h}H ${m}M`;
        };

        const totalTimeString = formatHM(totalMs);
        const remainingHoursRaw = remainingMs / (1000 * 60 * 60);
        const remainingTimeString = formatHM(remainingMs);

        // Clamp width percentage exclusively bound 0 -> 100
        let remainingPercentage = (remainingMs / totalMs) * 100;
        if (remainingPercentage < 0) remainingPercentage = 0;
        if (remainingPercentage > 100) remainingPercentage = 100;

        // Auto-critical threat escalation if remaining threshold drops below 2 hours (as per prompt)
        const isCritical = remainingHoursRaw < 2;

        return {
            totalTimeString,
            remainingTimeString,
            remainingPercentage,
            isCritical
        };
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 md:px-8 font-sans relative overflow-hidden text-slate-300">
            {/* Ambient Logistics Lighting */ }
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto z-10 relative">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-900/30 pb-8">
                    <div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-900/20 border border-amber-500/30 mb-6 font-bold text-amber-500">
                            <Snowflake className="w-5 h-5 animate-pulse" /> Cold Ischemia Logistics Grid
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                            Organ & Plasma <span className="text-amber-500">Node</span>
                        </motion.h1>
                    </div>
                     <div className="text-left md:text-right">
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Live Grid Status</p>
                        <p className="text-2xl font-mono text-white flex items-center md:justify-end gap-3 mt-1">
                             <Activity className={`w-6 h-6 ${error ? 'text-rose-500' : 'text-amber-500'}`} />
                             {error ? "OFFLINE" : tick % 2 === 0 ? "SYNCING..." : "LIVE FEED"}
                        </p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                {/* Secure Loading States */}
                {loading ? (
                    <motion.div key="skeleton" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                        {[1, 2, 3, 4].map(i => (
                            <motion.div key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="bg-slate-900/40 border border-amber-900/20 rounded-[2rem] p-8 h-[340px] flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-amber-900/30"></div>
                                        <div className="space-y-2">
                                            <div className="w-32 h-6 bg-slate-800/80 rounded-full"></div>
                                            <div className="w-24 h-3 bg-slate-800/80 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="w-24 h-8 bg-slate-800/80 rounded-lg"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <div className="w-32 h-4 bg-slate-800/80 rounded-full"></div>
                                        <div className="w-20 h-4 bg-slate-800/80 rounded-full"></div>
                                    </div>
                                    <div className="w-full h-4 bg-slate-950 rounded-full border border-white/5"></div>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <div className="space-y-2">
                                        <div className="w-24 h-3 bg-slate-800/80 rounded-full"></div>
                                        <div className="w-32 h-8 bg-slate-800/80 rounded-md"></div>
                                    </div>
                                    <div className="w-32 h-10 bg-slate-800/80 rounded-xl mt-4"></div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : error ? (
                    <motion.div key="error" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="bg-rose-950/40 border border-rose-500/40 p-8 rounded-3xl text-center shadow-xl backdrop-blur-md">
                        <Activity className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-bounce" />
                        <h2 className="text-white text-2xl font-black mb-2 uppercase tracking-wide">Connection Blocked</h2>
                        <p className="text-rose-300 font-medium">Failed to communicate with local logistics grid via WebSockets. Check backend API status.</p>
                        <p className="text-slate-500 text-sm mt-4 font-mono font-bold">{error}</p>
                    </motion.div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {organs.length === 0 && (
                         <div className="col-span-full text-center py-16 opacity-70 bg-slate-900/30 border border-white/5 rounded-3xl">
                             <Snowflake className="w-10 h-10 mx-auto text-slate-500 mb-4" />
                             <p className="text-amber-500 font-bold tracking-widest uppercase text-lg">Grid Empty: No active organ logistics taking place</p>
                         </div>
                    )}
                    
                    {organs.map((organ, idx) => {
                        const metrics = calculateMetrics(organ.collectedAt, organ.viabilityDeadline);
                        const { isCritical } = metrics;
                        
                        return (
                        <motion.div 
                            key={organ.id} 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }}
                            className={`bg-slate-900/60 backdrop-blur-xl border-2 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-all ${isCritical ? 'border-rose-900 hover:border-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.1)]' : 'border-amber-900/40 hover:border-amber-600'}`}
                        >
                            {isCritical && <div className="absolute inset-0 bg-gradient-to-t from-rose-900/20 to-transparent opacity-50 pointer-events-none"></div>}

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                     <div className={`p-4 rounded-full border shadow-inner ${isCritical ? 'bg-rose-950 border-rose-500 text-rose-500' : 'bg-amber-950/50 border-amber-600/50 text-amber-500'}`}>
                                         <ThermometerSnowflake className="w-8 h-8" />
                                     </div>
                                     <div>
                                         <h3 className="text-2xl font-black text-white">{organ.resourceType || "Secure Cargo"}</h3>
                                         <p className="text-xs font-mono tracking-[0.2em] uppercase mt-1 text-slate-400 font-bold">{organ.journeyStatus}</p>
                                     </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isCritical ? 'bg-rose-500 border-rose-400 text-white animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.8)]' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                                    <Timer className="w-4 h-4" /> {metrics.remainingTimeString} LEFT
                                </div>
                            </div>

                            <div className="relative z-10 mb-3 flex justify-between text-xs font-bold uppercase tracking-wider">
                                 <span className="text-slate-400">Cold Ischemia Progress Bar</span>
                                 <span className={isCritical ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(225,29,72,0.8)]' : 'text-amber-400'}>{metrics.remainingTimeString} / {metrics.totalTimeString} REMAINING</span>
                            </div>
                            
                            {/* Computed Analytics Engine Viability Bar */}
                            <div className="w-full h-4 bg-slate-950 rounded-full border border-white/5 overflow-hidden shadow-inner relative z-10">
                                <motion.div 
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${metrics.remainingPercentage}%` }}
                                    transition={{ duration: 1.5, type: "spring", stiffness: 50 }}
                                    className={`h-full rounded-full border-r-2 border-white/50 ${isCritical ? 'bg-gradient-to-l from-rose-400 to-rose-700 shadow-[0_0_20px_rgba(225,29,72,1)]' : 'bg-gradient-to-l from-amber-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.8)]'}`}
                                ></motion.div>
                            </div>

                            <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10 relative z-10">
                                <div>
                                    <p className="text-xs uppercase font-semibold text-slate-500 mb-1">Cross-Matching ID</p>
                                    <p className={`font-mono font-bold text-sm bg-slate-950 px-2 py-1 rounded inline-block ${isCritical ? 'text-rose-400 border border-rose-900/50' : 'text-white border border-slate-800'}`}>UID-{organ.id.toString().padStart(6, '0')}</p>
                                </div>
                                <button className={`px-6 py-2.5 rounded-xl font-bold transition-all border ${isCritical ? 'bg-rose-600 border-rose-500 hover:bg-rose-500 text-white shadow-[0_5px_15px_rgba(225,29,72,0.3)]' : 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-slate-900'}`}>
                                    Enforce Protocol
                                </button>
                            </div>
                        </motion.div>
                        )
                    })}
                </div>
                )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default OrganNodePage;
