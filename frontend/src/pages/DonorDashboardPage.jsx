import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Award, Calendar, Clock, Activity, Medal, ShieldCheck, HeartPulse } from 'lucide-react';
import BloodJourneyTracker from '../components/BloodJourneyTracker';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';

const DonorDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiFetch('/api/premium/dashboard/1');
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
     return (
        <div className="min-h-screen bg-slate-950 flex shadow-2xl items-center justify-center">
            <Activity className="w-12 h-12 text-rose-500 animate-spin" />
        </div>
     );
  }

  if (!dashboardData) {
     return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Error loading dashboard</div>;
  }

  const { donorInfo, daysUntilEligible, donationJourney } = dashboardData;
  const recentJourney = donationJourney && donationJourney.length > 0 ? donationJourney[0] : {};
  const currentStatus = recentJourney.journeyStatus || 'Collected';
  const eligibilityPercentage = Math.max(0, Math.min(100, ((56 - daysUntilEligible) / 56) * 100));
  const badgesStr = donorInfo?.badges || "";

  const bloodTypeBase = donorInfo?.bloodGroup ? donorInfo.bloodGroup.replace(/[+-]/g, '') : 'O';
  const bloodTypeSign = donorInfo?.bloodGroup ? donorInfo.bloodGroup.replace(/[a-zA-Z]/g, '') : '+';

  // Force mock unlock of first two badges for presentation showcase per prompt
  const activeBadgesStr = badgesStr + "Newcomer Night Saver";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-950 pt-24 pb-16 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Hero / Vitals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Intro */}
            <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">Welcome back, <span className="text-rose-500">{donorInfo?.name || 'Hero'}</span></h1>
                <p className="text-slate-400 text-lg max-w-xl">
                   {daysUntilEligible === 0 
                     ? "You are fully recovered and eligible to save up to 3 more lives today." 
                     : `Your cooldown period is active. You will be eligible to donate again in ${daysUntilEligible} days.`}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setIsScheduleModalOpen(true)} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-[0_10px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_10px_30px_rgba(225,29,72,0.5)] transition-all">Schedule Appointment</button>
                    <button onClick={() => setIsProfileDrawerOpen(true)} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-inner">View Medical Profile</button>
                </div>
            </div>

            {/* Vitals & Eligibility */}
            <div className="bg-gradient-to-br from-rose-950 to-slate-900 border border-rose-900/30 rounded-[2.5rem] p-8 shadow-2xl flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-rose-400 font-bold tracking-widest uppercase text-sm flex items-center gap-2"><HeartPulse className="w-5 h-5" /> Vitals</h3>
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
                
                <div className="flex items-end justify-between border-b border-rose-900/50 pb-6 mb-6">
                    <div>
                        <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Blood Type</p>
                        <p className="text-5xl font-black text-white leading-none">{bloodTypeBase}<span className="text-rose-500 text-4xl align-top">{bloodTypeSign}</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Status</p>
                        <p className="text-xl font-bold text-emerald-400">Universal</p>
                    </div>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-slate-400 text-sm font-bold">Eligibility Window</p>
                        <p className="text-white text-sm font-bold bg-rose-500/20 px-3 py-1 rounded-full text-rose-400">{daysUntilEligible === 0 ? 'Eligible Now' : `${daysUntilEligible} Days Left`}</p>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-rose-500 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.8)] transition-all duration-1000" style={{ width: `${eligibilityPercentage}%` }}></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Live Journey Tracker */}
        <BloodJourneyTracker journeyStatus={currentStatus} />

        {/* Gamification / Badges */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-8">
                <Award className="w-6 h-6 text-amber-400" /> Milestone Badges
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { title: "Newcomer", icon: Droplet, activeBg: "bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/20", activeIcon: "text-white", inactiveColor: "text-rose-400", desc: "Registered Node" },
                    { title: "Night Saver", icon: Clock, activeBg: "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20", activeIcon: "text-white", inactiveColor: "text-indigo-400", desc: "Donated past 8PM" },
                    { title: "Grid Hero", icon: Activity, activeBg: "bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20", activeIcon: "text-white", inactiveColor: "text-cyan-400", desc: "Matched within 5 mins" },
                    { title: "Gallon Club", icon: Medal, activeBg: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20", activeIcon: "text-white", inactiveColor: "text-amber-400", desc: "8+ Pints Donated" }
                ].map((badge, idx) => {
                    const isLocked = !activeBadgesStr.includes(badge.title);
                    return (
                    <motion.div 
                      key={idx} 
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`p-6 rounded-3xl border flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300
                          ${isLocked 
                             ? 'opacity-40 grayscale bg-slate-800/50 border-slate-700/50 hover:border-slate-500/50' 
                             : `border-transparent ${badge.activeBg} transform-gpu`}`}
                    >
                        <div className={`p-4 rounded-full bg-slate-900/30 shadow-inner mb-4 transition-colors ${isLocked ? badge.inactiveColor : badge.activeIcon}`}>
                            <badge.icon className="w-8 h-8" />
                        </div>
                        <h4 className="text-white font-bold text-lg">{badge.title}</h4>
                        <p className={`${isLocked ? 'text-slate-400' : 'text-white/80'} py-1 text-xs font-medium`}>{isLocked ? '(Locked)' : badge.desc}</p>
                    </motion.div>
                )})}
            </div>
        </div>

      </div>

      <AnimatePresence>
        {isScheduleModalOpen && (
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
             <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-slate-900 border border-rose-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 to-rose-400"></div>
                <h3 className="text-2xl font-black text-white mb-2">Schedule Appointment</h3>
                <p className="text-slate-400 text-sm mb-6">Book your next life-saving donation at an authorized grid node.</p>
                
                <div className="space-y-4 mb-8">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Date</label>
                      <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-rose-500 transition-colors" />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Facility Location</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-rose-500 transition-colors">
                         <option>Vadodara General Hospital (Grid Alpha)</option>
                         <option>Hemodynamic Central Bank</option>
                      </select>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button onClick={() => setIsScheduleModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">Cancel</button>
                   <button onClick={() => {
                        toast.success("Appointment Scheduled Successfully!", {style: {background: '#020617', color: '#fff', border: '1px solid #e11d48'}});
                        setIsScheduleModalOpen(false);
                   }} className="flex-1 py-3 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-[0_5px_15px_rgba(225,29,72,0.4)] transition-all">Confirm Booking</button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Drawer for Medical Profile */}
      <AnimatePresence>
        {isProfileDrawerOpen && (
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end"
             onClick={() => setIsProfileDrawerOpen(false)}
          >
             <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-sm h-full bg-slate-900 border-l border-slate-700 p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
             >
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xl font-black text-white">Medical Profile</h3>
                   <button onClick={() => setIsProfileDrawerOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
                </div>
                
                <div className="space-y-6">
                   <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Blood Pressure</p>
                      <p className="text-2xl font-black text-white">118 / <span className="text-slate-400">76</span></p>
                      <p className="text-xs text-emerald-400 mt-1 font-bold">Optimal Range</p>
                   </div>
                   <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Iron Levels (Ferritin)</p>
                      <p className="text-2xl font-black text-white">45 <span className="text-sm font-bold text-slate-500">ng/mL</span></p>
                      <p className="text-xs text-emerald-400 mt-1 font-bold">Healthy for Donation</p>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default DonorDashboardPage;
