import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useDonorStore from '../store/useDonorStore';
import { apiFetch } from '../utils/api';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
  out: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const heartbeatTransition = {
  scale: [1, 1.05, 1, 1.05, 1],
  transition: { duration: 0.5 }
};

const FindBloodPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ bloodGroup: '', country: 'India', city: '' });
  
  const navigate = useNavigate();
  const setGlobalSearchResults = useDonorStore(state => state.setGlobalSearchResults);
  const setIsFetchingDonors = useDonorStore(state => state.setIsFetchingDonors);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      setIsFetchingDonors(true);

      try {
        const params = new URLSearchParams();
        if (formData.bloodGroup) params.append('bloodGroup', formData.bloodGroup);
        params.append('lat', position.coords.latitude);
        params.append('lng', position.coords.longitude);
        params.append('radius', 50.0);

        const response = await apiFetch(`/api/donors/search?${params.toString()}`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setGlobalSearchResults(data);
        setIsFetchingDonors(false);
        setLoading(false);
        navigate('/donors');

      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("System Offline! Check backend connection.");
        setIsFetchingDonors(false);
        setLoading(false);
      }
    }, () => {
      toast.error("Location Access Denied! Enable GPS to search.");
      setLoading(false);
    });
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-[85vh] py-20 px-6 flex flex-col items-center justify-center relative z-10">
      <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-950/30 rounded-bl-full"></div>

        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className="bg-gradient-to-br from-rose-900 to-red-950 p-4 rounded-2xl text-rose-500 shadow-inner border border-rose-800/50">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Global API Search</h1>
            <p className="text-slate-400 font-bold mt-1">Querying the unified database</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-slate-300 mb-2 uppercase tracking-wider">Target Blood Group</label>
              <select onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/50 outline-none font-bold text-lg text-white transition-all cursor-pointer shadow-inner">
                <option value="">Any Group (Show All)</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-black text-slate-300 mb-2 uppercase tracking-wider">Urgency Level</label>
              <select className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/50 outline-none font-bold text-lg text-rose-500 transition-all cursor-pointer shadow-inner">
                <option value="normal">Normal (24-48 hrs)</option>
                <option value="urgent">Urgent (12 hrs)</option>
                <option value="critical">Critical (Immediate)</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-slate-300 mb-2 uppercase tracking-wider">Target Country</label>
              <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/50 outline-none font-bold text-lg text-white transition-all cursor-pointer shadow-inner">
                <option value="India">India</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-black text-slate-300 mb-2 uppercase tracking-wider">City / Zone</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-6 h-6" />
                <input type="text" placeholder="e.g. Vadodara, Mumbai" onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full pl-14 p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/50 outline-none font-bold text-lg text-white transition-all placeholder-slate-500 shadow-inner" />
              </div>
            </div>
          </div>

          <motion.button whileHover={!loading ? heartbeatTransition : {}} type="submit" disabled={loading} className="w-full bg-gradient-to-r from-rose-600 to-red-700 text-white py-5 mt-6 rounded-xl font-black text-xl shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] flex justify-center items-center gap-3 disabled:opacity-50">
            {loading ? <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span> : <><Globe className="w-6 h-6" /> Execute System Scan</>}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default FindBloodPage;
