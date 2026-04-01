import React from 'react';
import { Heart, MapPin, Globe } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-950 text-slate-400 py-16 border-t-[6px] border-rose-600 mt-auto relative overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
    <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left relative z-10">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center justify-center md:justify-start gap-3 mb-4 tracking-tighter">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> LifeConnect
        </h2>
        <p className="text-sm font-bold leading-relaxed max-w-xs mx-auto md:mx-0">The global decentralized healthcare network. Built for high performance, maximum security, and saving lives.</p>
      </div>
      <div className="flex flex-col gap-4 font-bold">
        <h3 className="text-white text-lg tracking-widest uppercase">Network Hubs</h3>
        <span className="flex items-center justify-center md:justify-start gap-3 bg-slate-900 w-fit mx-auto md:mx-0 px-4 py-2 rounded-lg border border-slate-800"><MapPin className="w-5 h-5 text-rose-500" /> Vadodara, IN (HQ)</span>
        <span className="flex items-center justify-center md:justify-start gap-3 bg-slate-900 w-fit mx-auto md:mx-0 px-4 py-2 rounded-lg border border-slate-800"><Globe className="w-5 h-5 text-blue-500" /> San Francisco, USA</span>
      </div>
      <div className="font-bold flex flex-col justify-center md:justify-start">
        <h3 className="text-white text-lg tracking-widest uppercase mb-4">System Links</h3>
        <div className="flex flex-col gap-4 justify-center md:justify-start text-xs uppercase tracking-widest text-slate-500">
          <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2 md:justify-start justify-center"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> API Status: Operational</span>
          <span className="hover:text-white cursor-pointer transition-colors">Security & Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Global Routing Docs</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
