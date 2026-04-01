import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Capillary / Tech Grid */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_60%,transparent_100%)]"></div>
    
    {/* Primary Arterial Flow (Deep Red) */}
    <motion.div
      animate={{ x: ['-20vw', '120vw'], y: ['120vh', '-20vh'] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute w-[40vw] h-[40vw] rounded-full bg-rose-600/10 blur-[150px]"
    />
    
    {/* Secondary Venous Flow */}
    <motion.div
      animate={{ x: ['120vw', '-20vw'], y: ['-20vh', '120vh'] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 5 }}
      className="absolute w-[50vw] h-[50vw] rounded-full bg-red-700/10 blur-[150px]"
    />

    {/* Subtle Oxygenation Nodes (Blue hints) */}
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[30%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-cyan-500/5 blur-[120px]"
    />
  </div>
);

export default AnimatedBackground;
