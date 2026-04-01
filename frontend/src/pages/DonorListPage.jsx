import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Droplets, Activity, AlertTriangle, ChevronRight, Unlock, Radio } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useDonorStore from '../store/useDonorStore';
import { apiFetch } from '../utils/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15, staggerChildren: 0.1 } },
  out: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

const heartbeatTransition = {
  scale: [1, 1.05, 1, 1.05, 1],
  transition: { duration: 0.5 }
};

const DonorListPage = () => {
  const donors = useDonorStore(state => state.globalSearchResults);
  const loading = useDonorStore(state => state.isFetchingDonors);
  
  const [revealedPhones, setRevealedPhones] = useState({});
  const [dispatchLoading, setDispatchLoading] = useState(null);

  const handleRevealPhone = (id) => {
    setRevealedPhones(prev => ({ ...prev, [id]: true }));
  };

  const handleEmergencyDispatch = async (donor) => {
    setDispatchLoading(donor.id);
    try {
      const params = new URLSearchParams();
      params.append('resourceType', donor.bloodGroup);
      params.append('city', donor.city);
      params.append('lat', donor.latitude || 0);
      params.append('lng', donor.longitude || 0);

      const response = await apiFetch(`/api/premium/sos-overdrive?${params.toString()}`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error("Dispatch protocol failure");
      toast.success("Dispatch Emails & WebSockets Transmitted Successfully.", {
        style: { border: '1px solid #10b981', background: '#022c22', color: '#fff' },
        iconTheme: { primary: '#10b981', secondary: '#fff' }
      });
    } catch (err) {
      toast.error("Transmission Failed. Grid Unresponsive.");
    } finally {
      setDispatchLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative z-10">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-rose-900/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent animate-spin"></div>
          <Activity className="w-10 h-10 text-rose-500 animate-pulse" />
        </div>
        <p className="mt-6 text-sm font-black text-rose-500 uppercase tracking-widest animate-pulse">Running Global Query...</p>
      </div>
    );
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="py-20 min-h-screen relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-rose-900/30 pb-6 gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-white flex items-center gap-4">
              <span className="bg-rose-950/50 p-3 rounded-2xl border border-rose-900 text-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.3)]">
                <Activity className="w-8 h-8" />
              </span>
              Triage Results
            </h1>
            <p className="text-cyan-400 mt-3 font-bold text-lg">Active nodes matching your criteria parameter.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-900/80 backdrop-blur border border-slate-800 px-6 py-3 rounded-xl shadow-inner text-center">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Grid Match count</p>
              <p className="text-3xl font-black text-white">{!donors ? 0 : donors.length}</p>
            </div>
            <Link to="/search" className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl border border-slate-600 transition-all group">
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {(!donors || donors.length === 0) ? (
          <motion.div variants={itemVariants} className="bg-slate-900/80 backdrop-blur-xl p-16 rounded-[3rem] text-center border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 to-transparent"></div>
            <AlertTriangle className="w-20 h-20 text-slate-600 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-white mb-3">No Active Nodes Found</h2>
            <p className="text-slate-400 font-bold mb-8 max-w-md mx-auto">Try adjusting your spatial coordinates or expanding the hematology parameters.</p>
            <Link to="/search" className="inline-block bg-slate-800 text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
              Refine Search Parameters
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {donors.map((donor, idx) => {
              const borderState = donor.available ? 'border-l-emerald-500' : 'border-l-rose-500';
              const bgState = donor.available ? 'bg-emerald-500' : 'bg-rose-500';
              
              return (
                <motion.div key={donor.id || idx} variants={itemVariants} className="h-full">
                  <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.1} glareColor="#fff" glarePosition="all" scale={1.02} transitionSpeed={2000} className="h-full block">
                    <div className={`bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl shadow-xl h-full flex flex-col justify-between border border-slate-800/50 ${borderState} border-l-[6px]`}>
                      
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Bio-Signature</p>
                            <h3 className="text-2xl font-black text-white line-clamp-1 flex items-center gap-2"><User className="w-5 h-5 text-slate-400" /> {donor.name}</h3>
                          </div>
                          <div className="bg-rose-950/30 text-rose-500 px-4 py-2 rounded-xl text-lg font-black shadow-inner border border-rose-900/50">
                            {donor.bloodGroup}
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          <div className="flex items-center gap-3 text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                            <MapPin className="w-5 h-5 text-cyan-400" />
                            <p className="font-bold">{donor.city}, {donor.state}</p>
                          </div>
                          
                          <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                            <div className="flex items-center gap-3 text-slate-300">
                              <Droplets className="w-5 h-5 text-rose-400" />
                              <p className="font-bold">Grid Status</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full animate-pulse ${bgState}`}></span>
                              <span className={`text-xs font-black uppercase tracking-wider ${donor.available ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {donor.available ? 'Available' : 'Engaged'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Secure Comm-Link:</p>
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-950 px-4 py-3 rounded-xl font-mono tracking-widest text-slate-300 flex-1 text-center border border-slate-800 shadow-inner relative overflow-hidden">
                            <AnimatePresence mode="wait">
                              {revealedPhones[donor.id] ? (
                                <motion.span key="revealed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-emerald-400 font-bold block">
                                  {donor.phone}
                                </motion.span>
                              ) : (
                                <motion.span key="masked" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="text-slate-500 block">
                                  {"+91 ••••• ••"}
                                  <span className="text-slate-300">{donor.phone?.slice(-3) || "492"}</span>
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                          {!revealedPhones[donor.id] && (
                            <button onClick={() => handleRevealPhone(donor.id)} className="p-3 bg-slate-800/80 rounded-xl hover:bg-cyan-950/50 border border-slate-700 hover:border-cyan-500 transition-colors shadow-lg group">
                              <Unlock className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                            </button>
                          )}
                        </div>

                        <motion.button 
                          whileHover={dispatchLoading !== donor.id ? heartbeatTransition : {}} 
                          onClick={() => handleEmergencyDispatch(donor)}
                          disabled={dispatchLoading === donor.id}
                          className="w-full bg-gradient-to-r from-rose-600 to-red-700 text-white px-4 py-4 rounded-xl font-black text-sm uppercase tracking-wide shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] disabled:opacity-50 mt-5 transition-all">
                          {dispatchLoading === donor.id ? <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span> : <><Radio className="w-5 h-5" /> Initiate Emergency Dispatch</>}
                        </motion.button>
                      </div>

                    </div>
                  </Tilt>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
export default DonorListPage;
