import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_RECENT_URL = 'http://localhost:8080/api/donors/recent';

const LiveTicker = () => {
  const [liveEvents, setLiveEvents] = useState([
    "✅ System Initializing...",
    "⚡ Establishing connection to global grid...",
    "✅ Grid capacity verified."
  ]);

  useEffect(() => {
    const fetchRecentDonors = async () => {
      try {
        const response = await fetch(API_RECENT_URL);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        
        if (data && data.length > 0) {
          const events = data.map(donor => `✅ New Node Online: ${donor.bloodGroup} in ${donor.city}, ${donor.country}`);
          setLiveEvents(events);
        }
      } catch (error) {
        setLiveEvents(["⚠️ Connection to grid unstable. Retrying..."]);
      }
    };

    fetchRecentDonors(); // Initial fetch
    const interval = setInterval(fetchRecentDonors, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-[72px] w-full z-40 bg-slate-900 h-[40px] flex items-center shadow-md overflow-hidden border-b border-slate-800">
      <div className="container mx-auto flex items-center w-full h-full relative px-6">
        <div className="absolute left-0 bg-slate-900 h-full flex items-center px-6 z-10 border-r border-slate-700 shadow-[10px_0_15px_-3px_rgba(15,23,42,1)]">
          <span className="bg-slate-800 text-rose-500 border border-rose-900 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span> LIVE
          </span>
        </div>
        <div className="w-full pl-24 overflow-hidden h-full flex items-center">
          <motion.div animate={{ x: [0, -2000] }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="flex gap-12 text-slate-300 text-xs font-semibold whitespace-nowrap pr-[100vw]">
            {[...liveEvents, ...liveEvents, ...liveEvents].map((event, idx) => (
              <span key={idx} className={event.includes('⚠️') ? "text-orange-400" : ""}>{event}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LiveTicker;
