import React from 'react';
import { motion, animate, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Server, Activity, CheckCircle, Clock } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
  out: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const BLOOD_COLORS = ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#94a3b8', '#64748b', '#475569', '#334155'];

const dispatchLogs = [
  { time: '10:42 AM', msg: 'Match Found: O- in Sector 7. Routing initiated.' },
  { time: '10:38 AM', msg: 'Emergency Request resolved. Latency: 14ms.' },
  { time: '10:15 AM', msg: 'New Bio-Signature registered in Vadodara.' },
  { time: '09:55 AM', msg: 'Grid Capacity re-balanced. Status optimal.' },
];

const CountUp = ({ to, prefix="", suffix = "", decimals = 0 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    prefix + Number(latest).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
  );
  useEffect(() => {
    const controls = animate(count, to, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [to, count]);
  return <motion.span>{rounded}</motion.span>;
};

const CommandCenterPage = () => {
  const [ecgData, setEcgData] = useState(Array.from({ length: 40 }).map((_, i) => ({ time: `${i}s`, requests: 12 })));
  const [treasuryData, setTreasuryData] = useState([]);
  const [activeNodes, setActiveNodes] = useState(0);
  const [totalLitersRouted, setTotalLitersRouted] = useState(0);
  const [matchingLatency, setMatchingLatency] = useState(1.4);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiFetch('/api/donors/analytics');
        if (res.ok) {
          const data = await res.json();
          setActiveNodes(data.activeNodes || 0);
          setTotalLitersRouted(data.totalLitersRouted || 148000);
          if (data.treasuryDistribution) setTreasuryData(data.treasuryDistribution);
          
          const latency = data.matchingLatency || 1.4;
          setMatchingLatency(latency);
          
          setEcgData(prev => {
            const newPoint = {
              time: new Date().toLocaleTimeString([], { second: '2-digit' }),
              requests: latency
            };
            return [...prev.slice(1), newPoint]; // Maintain exactly 40 points
          });
        }
      } catch(err) {
        console.error("Analytics poll error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
    const poll = setInterval(fetchAnalytics, 2000);
    return () => clearInterval(poll);
  }, []);
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-[85vh] py-12 px-6 lg:px-12 relative z-10 w-full max-w-[1600px] mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-rose-900/30 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-rose-500 animate-pulse" /> Hemodynamic Command Center
          </h1>
          <p className="text-cyan-400 mt-2 font-bold text-lg">System Administration & Analytics Grid</p>
        </div>
        <span className="bg-rose-950/50 text-rose-500 px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-2 border border-rose-900/50">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span> Admin Authorized
        </span>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="skeleton" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <motion.div key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5 h-[120px]"></motion.div>
              ))}
            </div>
            <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/5 mb-8 w-full h-[400px]"></motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2].map(i => (
                <motion.div key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/5 h-[400px]"></motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Total Active Nodes", value: <CountUp to={activeNodes} />, icon: Server, color: "text-rose-500" },
          { title: "Total Liters Routed", value: <CountUp to={totalLitersRouted} decimals={1} />, icon: ShieldAlert, color: "text-emerald-400" },
          { title: "Matching Latency", value: <CountUp to={matchingLatency} decimals={1} suffix="ms" />, icon: Activity, color: "text-cyan-400" }
        ].map((stat, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 flex items-center justify-between group hover:border-slate-600 transition-all">
            <div>
              <p className="text-slate-300 font-bold uppercase tracking-widest text-xs mb-1">{stat.title}</p>
              <h3 className="text-4xl font-black text-white">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-xl bg-slate-900/50 shadow-inner border border-white/5`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/10 mb-8 w-full h-[400px]">
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span> Network Pulse (Active Requests)
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ecgData}>
            <RechartsTooltip 
              contentStyle={{ backgroundColor: '#020617', border: '1px solid #e11d48', borderRadius: '10px' }}
              itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
            />
            <Line 
              type="step" 
              dataKey="requests" 
              stroke="#e11d48" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 8, fill: '#e11d48', stroke: '#fff', strokeWidth: 2 }} 
              style={{ filter: 'drop-shadow(0 0 8px rgba(225,29,72,0.8))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/10 h-[400px]">
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Live Treasury Distribution</h3>
          <p className="text-xs font-bold text-slate-400 mb-6">Global Hemodynamic Distribution Grid</p>
          <div className="w-full flex flex-col gap-4 overflow-y-auto pr-2 h-[80%] custom-scrollbar">
             {treasuryData.map((item, i) => (
               <div key={i} className="w-full">
                  <div className="flex justify-between text-xs font-bold text-white mb-1 uppercase tracking-widest">
                     <span>{item.name}</span>
                     <span className="text-rose-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.8)]" 
                     />
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/10 h-[400px] flex flex-col">
          <h3 className="text-xl font-black text-cyan-400 mb-2 uppercase tracking-widest">System Triggers</h3>
          <p className="text-xs font-bold text-slate-400 mb-6">Recent Dispatch Logs</p>
          <div className="flex-grow flex flex-col justify-between">
            {dispatchLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="mt-1 flex-shrink-0 relative">
                  <CheckCircle className="w-5 h-5 text-emerald-500 relative z-10" />
                  <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-50"></span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm tracking-wide">{log.msg}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-bold"><Clock className="w-3 h-3" /> {log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommandCenterPage;
