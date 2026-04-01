import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, SearchCheck, LayoutDashboard, TestTube, AlertOctagon, Activity, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const stockLevels = [
    { type: 'O+', qty: 145, max: 200, status: 'healthy' },
    { type: 'O-', qty: 12, max: 100, status: 'critical' },
    { type: 'A+', qty: 89, max: 150, status: 'healthy' },
    { type: 'A-', qty: 45, max: 100, status: 'warning' },
    { type: 'B+', qty: 67, max: 120, status: 'healthy' },
    { type: 'B-', qty: 3, max: 50, status: 'critical' },
    { type: 'AB+', qty: 25, max: 80, status: 'warning' },
    { type: 'AB-', qty: 8, max: 40, status: 'warning' },
];

const mockLabQueue = [
    { id: 'BLD-8912', type: 'O-', test: 'Pathogen Screen 2', status: 'In Progress', time: '12m' },
    { id: 'BLD-4451', type: 'A+', test: 'Crossmatching', status: 'Pending', time: '45m' },
    { id: 'BLD-2993', type: 'B-', test: 'Antibody ID', status: 'In Progress', time: '5m' },
];

const HospitalHubPage = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [uidInput, setUidInput] = useState('');

    const handleDownload = () => {
        toast.success("Inventory exported successfully as CSV.", {
            style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
        });
    };

    const handleAuthenticate = (e) => {
        e.preventDefault();
        if(!uidInput.trim()) {
            toast.error("Please enter a valid UID.", {
                style: { background: '#1e293b', color: '#fff', border: '1px solid #e11d48' }
            });
            return;
        }
        
        // Simulate API call
        const loadingToast = toast.loading("Authenticating...", {
             style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
        });
        
        setTimeout(() => {
            toast.dismiss(loadingToast);
            if(uidInput.length > 5) {
                toast.success(`UID ${uidInput} verified completely. Proceed to collection.`, {
                    style: { background: '#1e293b', color: '#fff', border: '1px solid #10b981' }
                });
                setUidInput('');
            } else {
                toast.error(`UID ${uidInput} not found in global registry.`, {
                    style: { background: '#1e293b', color: '#fff', border: '1px solid #e11d48' }
                });
            }
        }, 1500);
    };

    const runLabTest = (id) => {
        toast.success(`Priority test initiated for ${id}.`, {
             style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6' }
        });
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 md:px-8 font-sans">
            <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">
                
                {/* Left Panel: Sidebar Nav */}
                <div className="w-full lg:w-64 bg-slate-900 border border-slate-800 rounded-3xl p-6 shrink-0 flex flex-col gap-4">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
                            <Building2 className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h2 className="font-black text-xl text-white">MedCenter<br/><span className="text-indigo-400 text-sm tracking-widest uppercase">Portal</span></h2>
                    </div>

                    <button 
                         onClick={() => setActiveTab('inventory')}
                         className={`flex items-center gap-3 w-full p-4 rounded-xl font-bold transition-all ${activeTab === 'inventory' ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)] text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-transparent hover:border-slate-600'}`}>
                        <LayoutDashboard className="w-5 h-5" /> Stock Inventory
                    </button>
                    <button 
                         onClick={() => setActiveTab('auth')}
                         className={`flex items-center gap-3 w-full p-4 rounded-xl font-bold transition-all ${activeTab === 'auth' ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)] text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-transparent hover:border-slate-600'}`}>
                        <SearchCheck className="w-5 h-5" /> Authenticate UID
                    </button>
                    <button 
                         onClick={() => setActiveTab('lab')}
                         className={`flex items-center justify-between w-full p-4 rounded-xl font-bold transition-all ${activeTab === 'lab' ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)] text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-transparent hover:border-slate-600'}`}>
                        <span className="flex items-center gap-3"><TestTube className="w-5 h-5" /> Lab Processing</span>
                        {activeTab !== 'lab' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>}
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-8 min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'inventory' && (
                            <motion.div key="inventory" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8 h-full">
                                {/* Top Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { label: "Total Supply (Units)", val: "394", icon: TestTube, color: "text-emerald-400", border: "border-emerald-500/30" },
                                        { label: "Pending Processing", val: "18", icon: Activity, color: "text-amber-400", border: "border-amber-500/30" },
                                        { label: "Critical Shortages", val: "2", icon: AlertOctagon, color: "text-rose-500", border: "border-rose-500/30", pulse: true }
                                    ].map((stat, i) => (
                                        <div key={i} className={`bg-slate-900 border ${stat.border} p-6 rounded-[2rem] flex items-center gap-6 relative overflow-hidden`}>
                                            <div className={`p-4 rounded-2xl bg-slate-950 shadow-inner ${stat.color}`}>
                                                <stat.icon className={`w-8 h-8 ${stat.pulse ? 'animate-pulse' : ''}`} />
                                            </div>
                                            <div className="z-10">
                                                <p className="text-3xl font-black text-white">{stat.val}</p>
                                                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-1">{stat.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Inventory Bar Chart Area */}
                                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 lg:p-12 flex-1 shadow-2xl relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-12">
                                        <div>
                                            <h3 className="text-2xl font-black text-white tracking-tight">Internal Blood Vault</h3>
                                            <p className="text-slate-400 mt-1">Live stock tracking vs recommended clinic maximums.</p>
                                        </div>
                                        <button onClick={handleDownload} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-bold border border-slate-600 shadow-sm transition-all flex items-center gap-2">
                                            <Download className="w-4 h-4" /> Export
                                        </button>
                                    </div>

                                    {/* Bar Charts */}
                                    <div className="space-y-6">
                                        {stockLevels.map((lvl, idx) => {
                                            const percentage = (lvl.qty / lvl.max) * 100;
                                            const barColor = lvl.status === 'critical' ? 'bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.6)]' : lvl.status === 'warning' ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]';
                                            const textColor = lvl.status === 'critical' ? 'text-rose-400' : 'text-slate-300';

                                            return (
                                                <div key={idx} className="flex items-center gap-6">
                                                    <div className={`w-16 shrink-0 text-right font-black text-xl ${textColor} drop-shadow-md pb-[-10px]`}>
                                                        {lvl.type}
                                                    </div>
                                                    <div className="flex-1 h-8 bg-slate-950 overflow-hidden rounded-r-xl border border-slate-800 flex items-center relative">
                                                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10%_100%] z-0 pointer-events-none"></div>
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percentage}%` }}
                                                            transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.1 }}
                                                            className={`h-full ${barColor} relative z-10 flex items-center justify-end pr-3 rounded-r-lg min-w-[30px]`}
                                                        >
                                                            <span className="text-xs font-black text-white/90 drop-shadow-sm">{lvl.qty}U</span>
                                                        </motion.div>
                                                    </div>
                                                    <div className="w-16 shrink-0 text-left text-xs text-slate-500 font-mono">
                                                        Max {lvl.max}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'auth' && (
                            <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 lg:p-12 flex-1 shadow-2xl flex flex-col items-center justify-center text-center">
                                <div className="bg-indigo-500/10 p-6 rounded-full border border-indigo-500/20 mb-8">
                                    <SearchCheck className="w-16 h-16 text-indigo-400" />
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tight mb-4">Validate Network UID</h3>
                                <p className="text-slate-400 max-w-md mx-auto mb-8">Securely verify a donor or recipient's decentralized health record before proceeding with any medical operations.</p>
                                
                                <form onSubmit={handleAuthenticate} className="w-full max-w-lg mx-auto flex flex-col gap-4">
                                    <input 
                                        type="text" 
                                        value={uidInput}
                                        onChange={(e) => setUidInput(e.target.value)}
                                        placeholder="Enter 6-Digit UID (e.g. 849201)" 
                                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-6 py-4 font-mono text-center text-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                                    />
                                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all">
                                        Commence Verification
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'lab' && (
                            <motion.div key="lab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 lg:p-12 flex-1 shadow-2xl">
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-tight">Active Lab Pipeline</h3>
                                        <p className="text-slate-400 mt-1">18 pending units undergoing testing algorithms.</p>
                                    </div>
                                    <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Backlog: Critical
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {mockLabQueue.map((item, id) => (
                                        <div key={id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-between hover:border-slate-700 transition-colors">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex flex-col items-center justify-center shadow-inner shrink-0">
                                                    <span className="font-black text-white">{item.type}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold font-mono">{item.id}</h4>
                                                    <p className="text-sm text-slate-400 flex items-center gap-2"><TestTube className="w-3 h-3 text-indigo-400"/> {item.test}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 sm:ml-auto w-full sm:w-auto">
                                                <div className="flex flex-col items-start sm:items-end">
                                                    <span className={`text-xs font-bold uppercase tracking-widest ${item.status === 'In Progress' ? 'text-amber-400' : 'text-slate-400'} flex items-center gap-1.5`}>
                                                        {item.status === 'In Progress' && <Clock className="w-3 h-3" />} {item.status}
                                                    </span>
                                                    <span className="text-slate-500 text-xs font-mono mt-1">ETA: {item.time}</span>
                                                </div>
                                                <button onClick={() => runLabTest(item.id)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-bold text-sm border border-slate-700 transition-colors w-full sm:w-auto">
                                                    Expedite
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="text-center pt-8">
                                        <button className="text-slate-500 hover:text-slate-300 text-sm font-bold transition-colors underline underline-offset-4 decoration-slate-700">
                                            Load Full Queue (15 more)
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default HospitalHubPage;
