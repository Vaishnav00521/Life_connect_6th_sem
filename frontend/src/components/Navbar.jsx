import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Droplets, Menu, X, Activity } from 'lucide-react';

const heartbeatTransition = {
  scale: [1, 1.05, 1, 1.05, 1],
  transition: { duration: 0.5 }
};

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Live Map', path: '/map' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Organ Node', path: '/organ-node' }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-rose-900/30 shadow-lg h-[72px] flex items-center">
      <div className="container mx-auto px-6 flex justify-between items-center w-full">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="bg-gradient-to-br from-rose-600 to-red-800 p-2 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.5)] group-hover:shadow-[0_0_25px_rgba(225,29,72,0.8)] transition-all">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter">
            LifeConnect <span className="text-xs align-top text-cyan-400 font-bold uppercase tracking-widest ml-1 hidden sm:inline-block">Node</span>
          </h2>
        </Link>

        <ul className="hidden lg:flex gap-8 font-bold text-sm text-slate-400 items-center">
          {navLinks.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={`capitalize tracking-wide hover:text-white transition-colors relative py-2 ${location.pathname === item.path ? 'text-rose-500' : ''}`}>
                {item.name}
                {location.pathname === item.path && <motion.div layoutId="nav-pill" className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.8)]" />}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex gap-4 items-center">
          <Link to="/hospital-hub" className="text-slate-300 hover:text-white border border-slate-700 bg-slate-900/50 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-inner hover:bg-slate-800 text-sm">
            Hospital Hub
          </Link>
          <Link to="/dashboard" className="text-cyan-400 hover:text-white font-bold px-4 py-2 flex items-center gap-2 transition-colors border border-cyan-500/30 rounded-xl hover:bg-cyan-950/30 text-sm">
            Donor Dashboard
          </Link>
          <motion.div whileHover={heartbeatTransition}>
            <Link to="/register" className="bg-gradient-to-r from-rose-600 to-red-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] transition-all flex items-center gap-2 text-sm">
              <Droplets className="w-4 h-4 text-white" /> Register Node
            </Link>
          </motion.div>
        </div>

        <button className="lg:hidden text-white bg-slate-800 p-2 rounded-lg" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="absolute top-[72px] left-0 w-full lg:hidden bg-slate-900 border-b border-slate-800 shadow-xl overflow-hidden z-50">
            <div className="flex flex-col p-4 gap-2">
              {[...navLinks, {name: 'Hospital Hub', path: '/hospital-hub'}, {name: 'Dashboard', path: '/dashboard'}, {name: 'Register', path: '/register'}].map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileOpen(false)} className={`capitalize text-left py-4 px-6 rounded-xl font-bold ${location.pathname === item.path ? 'bg-rose-950/50 text-rose-500 border border-rose-900/50' : 'text-slate-400 hover:bg-slate-800'}`}>
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
