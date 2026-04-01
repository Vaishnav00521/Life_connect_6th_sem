import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, MapPin, Bell, Clock, Lock, Fingerprint, Smartphone, Mail, X, Server } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                ANIMATION DEMOS                             */
/* -------------------------------------------------------------------------- */

const RealTimeDemo = () => (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden bg-slate-950/40">
        {/* Dark map grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Center Patient (Red Pulse) */}
        <div className="relative z-10 w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,1)] flex items-center justify-center">
            <motion.div animate={{ scale: [1, 4], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }} className="absolute w-full h-full bg-rose-500 rounded-full"></motion.div>
        </div>

        {/* Green Dots (Donors) with dashed lines */}
        {/* Node 1 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, repeat: Infinity, repeatType: "reverse", duration: 2.5 }} className="absolute top-[25%] left-[25%] w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,1)]"></motion.div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/60 stroke-[2] border-dashed">
            <motion.line x1="25%" y1="25%" x2="50%" y2="50%" strokeDasharray="6,6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 1, repeat: Infinity, repeatDelay: 1 }} />
        </svg>

        {/* Node 2 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, repeat: Infinity, repeatType: "reverse", duration: 2.5 }} className="absolute bottom-[25%] right-[33%] w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,1)]"></motion.div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/60 stroke-[2] border-dashed">
            <motion.line x1="67%" y1="75%" x2="50%" y2="50%" strokeDasharray="6,6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.3, duration: 1, repeat: Infinity, repeatDelay: 1 }} />
        </svg>

        {/* Node 3 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, repeat: Infinity, repeatType: "reverse", duration: 2.5 }} className="absolute top-[33%] right-[25%] w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,1)]"></motion.div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/60 stroke-[2] border-dashed">
            <motion.line x1="75%" y1="33%" x2="50%" y2="50%" strokeDasharray="6,6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.8, duration: 1, repeat: Infinity, repeatDelay: 1 }} />
        </svg>
    </div>
);

const VerifiedIdentityDemo = () => {
    const keys = [1,2,3,4,5,6,7,8,9,'*',0,'#'];
    return (
        <div className="relative w-full h-full min-h-[300px] flex flex-col md:flex-row gap-8 items-center justify-center p-8 bg-slate-950/40">
            {/* Numpad */}
            <div className="grid grid-cols-3 gap-2 p-4 bg-slate-900/80 rounded-2xl border border-white/5 shrink-0 shadow-lg">
                {keys.map((k, i) => {
                    const isActive = [0, 4, 8, 7, 2, 5].includes(i); // Random sequence
                    return (
                        <motion.div 
                            key={k} 
                            animate={{ backgroundColor: isActive ? ['rgba(30,41,59,0.5)', 'rgba(16,185,129,0.5)', 'rgba(30,41,59,0.5)'] : 'rgba(30,41,59,0.5)' }} 
                            transition={{ delay: i*0.2, duration: 1.5, repeat: Infinity }} 
                            className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-sm font-mono text-slate-400 border border-slate-700/50 shadow-inner"
                        >
                            {k}
                        </motion.div>
                    )
                })}
            </div>
            {/* Biometric */}
            <div className="flex flex-col items-center justify-center w-full max-w-[200px]">
                {/* 6 Digit display */}
                <div className="flex gap-3 mb-10">
                     {[1,2,3,4,5,6].map((d, i) => (
                         <motion.div key={d} animate={{ opacity: [0.1, 1, 1], scale: [0.8, 1, 1] }} transition={{ delay: i * 0.3, duration: 2, repeat: Infinity }} className="w-8 h-8 border-b-2 border-emerald-500/50 flex items-center justify-center">
                             <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                         </motion.div>
                     ))}
                </div>

                <motion.div animate={{ color: ['#334155', '#10b981', '#10b981', '#334155'] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.8 }} className="relative drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Fingerprint className="w-20 h-20" strokeWidth={1.5} />
                    <motion.div animate={{ top: ['-10%', '110%'], opacity: [0, 1, 0, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.8 }} className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,1)]"></motion.div>
                </motion.div>
            </div>
        </div>
    );
};

const GeoFencingDemo = () => (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden bg-slate-950/40">
        {/* Radar Center */}
        <div className="relative w-3 h-3 rounded-full bg-cyan-400 z-20 shadow-[0_0_15px_rgba(34,211,238,1)]"></div>
        {/* Radar Rings */}
        <div className="absolute w-40 h-40 rounded-full border border-cyan-500/20"></div>
        <div className="absolute w-80 h-80 rounded-full border border-cyan-500/10"></div>
        
        {/* Radar Sweep */}
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute w-80 h-80 rounded-full border-r-2 border-cyan-400/80 bg-[conic-gradient(from_0deg,transparent_270deg,rgba(34,211,238,0.2)_360deg)] z-10"></motion.div>
        
        {/* Bells ringing when sweep hits (roughly) */}
        <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }} className="absolute top-1/4 right-1/4 z-30">
            <Bell className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        </motion.div>
        <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 2.5 }} className="absolute bottom-1/4 left-1/4 z-30">
            <Bell className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        </motion.div>
    </div>
);

const TriggersDemo = () => (
    <div className="relative w-full h-full min-h-[300px] flex flex-col sm:flex-row items-center justify-center gap-12 overflow-hidden bg-slate-950/40 p-4">
        <motion.div animate={{ x: [-150, 0, 0, -150], opacity: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, type: "spring", bounce: 0.4 }} className="w-56 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-rose-500/20 rounded-xl border border-rose-500/30"><Mail className="w-6 h-6 text-rose-400" /></div>
                <div className="h-3 w-20 bg-slate-700 rounded-full"></div>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full"></div>
            <div className="h-2 w-5/6 bg-slate-800 rounded-full"></div>
            <div className="h-2 w-4/6 bg-slate-800 rounded-full"></div>
        </motion.div>

        <motion.div animate={{ x: [150, 0, 0, 150], opacity: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, type: "spring", bounce: 0.4, delay: 0.2 }} className="w-56 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30"><Smartphone className="w-6 h-6 text-cyan-400" /></div>
                <div className="h-3 w-20 bg-slate-700 rounded-full"></div>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full"></div>
            <div className="h-2 w-5/6 bg-slate-800 rounded-full"></div>
            <div className="h-2 w-4/6 bg-slate-800 rounded-full"></div>
        </motion.div>
    </div>
);

const EncryptedDemo = () => {
    const [text, setText] = useState("+1-800-555-0199");
    const [isEncrypted, setIsEncrypted] = useState(false);
    
    useEffect(() => {
        const interval = setInterval(() => {
            let ticks = 0;
            setIsEncrypted(false);
            const scramble = setInterval(() => {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
                setText(Array(15).fill(0).map(() => chars[Math.floor(Math.random()*chars.length)]).join(''));
                ticks++;
                if (ticks > 15) {
                    clearInterval(scramble);
                    setText("eT8!qL^2mX$9pB");
                    setIsEncrypted(true);
                }
            }, 60);

            setTimeout(() => {
                setText("+1-800-555-0199");
                setIsEncrypted(false);
            }, 3500);

        }, 4500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full min-h-[300px] flex flex-col items-center justify-center px-4 bg-slate-950/40">
            <div className={`flex flex-col sm:flex-row items-center gap-8 px-10 py-8 rounded-[2rem] border transition-all duration-700 ${isEncrypted ? 'bg-cyan-950/40 border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.15)]' : 'bg-slate-900/80 border-white/5 shadow-2xl'}`}>
                <div className={`p-6 rounded-2xl border transition-colors duration-700 ${isEncrypted ? 'bg-cyan-900/40 border-cyan-500/50' : 'bg-slate-800/80 border-slate-700'}`}>
                    {isEncrypted ? <Lock className="w-10 h-10 text-cyan-400" /> : <Smartphone className="w-10 h-10 text-slate-400" />}
                </div>
                <div className="text-center sm:text-left font-mono min-w-[240px]">
                    <p className={`text-xs uppercase tracking-[0.2em] mb-3 transition-colors duration-700 ${isEncrypted ? 'text-cyan-500' : 'text-slate-500'}`}>
                        {isEncrypted ? 'AES-256 Ciphertext' : 'Raw Data Stream'}
                    </p>
                    <p className={`text-2xl sm:text-3xl font-bold tracking-widest transition-all duration-700 ${isEncrypted ? 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]' : 'text-slate-300'}`}>
                        {text}
                    </p>
                </div>
            </div>
        </div>
    )
};

const AvailabilityDemo = () => (
    <div className="relative w-full h-full min-h-[300px] flex flex-col items-center justify-center overflow-hidden px-8 bg-slate-950/40">
        <div className="absolute top-10 right-10">
            <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-3 backdrop-blur-md shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                <span className="text-sm font-black tracking-widest text-emerald-400 drop-shadow-sm">99.99% UPTIME</span>
            </div>
        </div>
        <div className="w-full flex items-center justify-center mt-12">
            <svg viewBox="0 0 500 150" className="w-full h-40 opacity-90" preserveAspectRatio="none">
                <motion.path 
                    d="M0,75 L80,75 L95,20 L130,130 L165,10 L200,90 L215,75 L500,75" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, pathOffset: 1 }}
                    animate={{ pathLength: 1, pathOffset: 0 }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    style={{ filter: "drop-shadow(0 0 10px rgba(16,185,129,0.8))" }}
                />
            </svg>
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE COMPONENT                          */
/* -------------------------------------------------------------------------- */

const featuresData = [
  { id: 1, title: "Real-Time Matching", icon: MapPin, desc: "Instant spatial connections between patients and donors via proximity grids.", demo: RealTimeDemo, span: "col-span-1 md:col-span-2 row-span-1" },
  { id: 2, title: "Verified Identity", icon: ShieldCheck, desc: "Multi-factor authentication guarantees absolute registry integrity.", demo: VerifiedIdentityDemo, span: "col-span-1 md:col-span-1 row-span-1" },
  { id: 3, title: "Geo-Fencing Alerts", icon: Activity, desc: "Seamless 10km radial push notifications keep local networks engaged.", demo: GeoFencingDemo, span: "col-span-1 md:col-span-1 row-span-1" },
  { id: 4, title: "Automated Triggers", icon: Bell, desc: "Instantly deploy programmatic SMS & Email event bindings.", demo: TriggersDemo, span: "col-span-1 md:col-span-2 row-span-1" },
  { id: 5, title: "Encrypted Data", icon: Lock, desc: "Military-grade AES-256 pipeline encrypting all PII data.", demo: EncryptedDemo, span: "col-span-1 md:col-span-2 row-span-1" },
  { id: 6, title: "24/7 Availability", icon: Clock, desc: "Unmatched 99.99% cloud uptime distributed worldwide.", demo: AvailabilityDemo, span: "col-span-1 md:col-span-1 row-span-1" },
];

const FeaturesPage = () => {
    const [selectedId, setSelectedId] = useState(null);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (selectedId) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [selectedId]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 py-24 px-4 sm:px-6 lg:px-8 font-sans relative">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Header */}
            <div className="max-w-7xl mx-auto text-center mb-20 relative z-10 pt-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-white/5 mb-6">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-slate-300 text-sm font-semibold tracking-wide uppercase">Architecture Overview</span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-6">
                    Hemodynamic <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-400">Enterprise.</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                    Explore our robust suite of life-saving infrastructure tailored for millisecond precision and unrivaled security. Click any module to inspect.
                </motion.p>
            </div>

            {/* Bento Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pb-20">
                {featuresData.map((feature) => (
                    <motion.div
                        layoutId={`card-${feature.id}`}
                        key={feature.id}
                        onClick={() => setSelectedId(feature.id)}
                        whileHover={{ scale: 1.01, translateY: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className={`cursor-pointer rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${feature.span}`}
                    >
                        <motion.div layoutId={`header-${feature.id}`} className="p-8 md:p-10 shrink-0 relative z-20 pointer-events-none bg-gradient-to-b from-white/[0.05] to-transparent">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-white/5 shadow-inner">
                                    <feature.icon className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white tracking-wide">{feature.title}</h3>
                            </div>
                            <p className="text-slate-400 text-base leading-relaxed">{feature.desc}</p>
                        </motion.div>
                        
                        <div className="flex-1 relative border-t border-white/[0.02] overflow-hidden pointer-events-none">
                            <feature.demo />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Expandable Modal (Shared Layout) */}
            <AnimatePresence>
                {selectedId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-8 py-10">
                        {/* Dim Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedId(null)}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
                        />
                        
                        {featuresData.map((feature) => {
                            if (feature.id !== selectedId) return null;
                            return (
                                <motion.div
                                    layoutId={`card-${feature.id}`}
                                    key={`modal-${feature.id}`}
                                    className="relative w-full max-w-5xl bg-slate-900 border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden z-10 max-h-[90vh]"
                                >
                                    {/* Close Button */}
                                    <button 
                                        onClick={() => setSelectedId(null)} 
                                        className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50 p-3 bg-slate-800 hover:bg-slate-700 rounded-full border border-white/10 transition-colors shadow-lg"
                                    >
                                        <X className="w-6 h-6 text-slate-300" />
                                    </button>

                                    <motion.div layoutId={`header-${feature.id}`} className="p-8 lg:p-12 border-b border-white/5 z-20 bg-gradient-to-b from-white/[0.03] to-transparent shrink-0">
                                        <div className="flex items-center gap-5 mb-4">
                                            <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/5 shadow-inner">
                                                <feature.icon className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                            </div>
                                            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">{feature.title}</h2>
                                        </div>
                                        <p className="text-slate-400 text-lg lg:text-xl max-w-3xl leading-relaxed">{feature.desc}</p>
                                    </motion.div>

                                    {/* Expanded Demo View */}
                                    <div className="flex-1 min-h-[400px] overflow-y-auto relative bg-slate-950 flex flex-col">
                                        <feature.demo />
                                    </div>
                                    
                                    {/* Bottom Decorative Bar */}
                                    <div className="h-2 w-full bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 shrink-0"></div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </AnimatePresence>
            
        </div>
    );
};

export default FeaturesPage;
