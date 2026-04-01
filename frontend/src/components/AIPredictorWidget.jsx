import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, AlertTriangle, CloudRainWind, ThermometerSun, ShieldAlert } from 'lucide-react';

const forecasts = [
  { id: 1, event: "Category 4 Hurricane", location: "Florida Coast", icon: CloudRainWind, severity: "critical", msg: "O-Negative supplies predicted to drop by 45% in 48 hours. Pre-emptive donor alerts activated." },
  { id: 2, event: "Severe Heatwave", location: "Phoenix Metro", icon: ThermometerSun, severity: "warning", msg: "Heat stroke admissions rising. Plasma demand projected to spike 20% by tomorrow." },
  { id: 3, event: "Major Pileup", location: "I-95 Corridor", icon: ShieldAlert, severity: "critical", msg: "Mass casualty event detected. Squeezing grid for 40 units of universal blood immediately." }
];

const AIPredictorWidget = () => {
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % forecasts.length);
        }, 8000); // Rotate every 8 seconds
        return () => clearInterval(interval);
    }, []);

    const prediction = forecasts[currentIdx];

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full pointer-events-none"
        >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto">
                {/* Header */}
                <div className="bg-slate-800/80 px-4 py-3 flex items-center justify-between border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-black text-white tracking-widest uppercase flex items-center gap-2">
                             Predictive AI Engine <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>
                        </span>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-4 min-h-[140px] relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={prediction.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col h-full justify-between"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${prediction.severity === 'critical' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                    <prediction.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{prediction.event}</h4>
                                    <p className="text-xs font-mono text-slate-400 flex items-center gap-1 mt-0.5"><AlertTriangle className="w-3 h-3" /> {prediction.location}</p>
                                </div>
                            </div>
                            <p className={`text-sm font-medium leading-relaxed ${prediction.severity === 'critical' ? 'text-rose-200' : 'text-amber-200'}`}>
                                {prediction.msg}
                            </p>
                            
                            {/* Animated Loading Bar to show when next prediction rotates */}
                            <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                                className={`absolute bottom-0 left-0 h-1 ${prediction.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'} shadow-[0_0_10px_currentColor]`}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default AIPredictorWidget;
