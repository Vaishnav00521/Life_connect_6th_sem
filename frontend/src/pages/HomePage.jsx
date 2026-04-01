import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';

const HeartLayer = ({ scale, delay, colorClass, rotate="0deg", xOffset="0px", yOffset="0px", zIndex=10, dropShadow="drop-shadow-2xl" }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0, rotate: 0 }}
    animate={{ scale, opacity: 1, rotate }}
    transition={{ type: 'spring', bounce: 0.3, duration: 2, delay }}
    className={`absolute top-1/2 left-1/2 flex items-center justify-center ${dropShadow}`}
    style={{ 
        width: `${scale * 100}%`, 
        height: `${scale * 100}%`,
        marginLeft: xOffset,
        marginTop: yOffset,
        zIndex,
        transformOrigin: 'center center'
    }}
  >
    <motion.div style={{ x: '-50%', y: '-50%', width:'100%', height:'100%' }}>
      <svg viewBox="0 0 100 90" className={`w-full h-full ${colorClass}`} xmlns="http://www.w3.org/2000/svg">
          <path d="M50,88 C50,88 5,60 5,28 C5,12 18,0 32,0 C42,0 48,7 50,12 C52,7 58,0 68,0 C82,0 95,12 95,28 C95,60 50,88 50,88 Z" fill="currentColor" />
      </svg>
    </motion.div>
  </motion.div>
);

const AnimatedNumber = ({ value, prefix = "", suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 50, duration: 3 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Intl.NumberFormat('en-US').format(Math.floor(latest)));
    });
  }, [springValue]);

  return <span ref={ref}>{prefix}{displayValue}{suffix}</span>;
};

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative min-h-screen flex flex-col pt-16 font-sans overflow-x-hidden">
        
        {/* Background Split - absolute to fill the Hero screen */}
        <div className="absolute inset-x-0 top-0 bottom-0 z-0 flex flex-col md:flex-row pointer-events-none">
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-[#d51317]"></div>
        </div>

        {/* Poster Content Hero */}
        <header className="relative z-10 flex-1 flex flex-col md:flex-row w-full min-h-[85vh]">
            
            {/* Left Box (White side) */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 py-20 bg-white">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-md mx-auto md:ml-auto md:mr-10 text-center md:text-left">
                    <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-[#bc1114] leading-[0.95] tracking-tighter uppercase sm:pt-14">
                        Let's Donate<br/>Blood & <br/>Save Lives
                    </h1>
                    
                    <p className="mt-8 text-slate-500 text-sm xl:text-base leading-relaxed max-w-[280px] mx-auto md:mx-0">
                        Join the world's most advanced decentralized blood map. Giving blood saves lives. Give the gift of life.
                    </p>

                    <div className="mt-12 flex flex-col gap-4 max-w-[250px] mx-auto md:mx-0 relative z-50">
                        <button onClick={() => navigate('/search')} className="bg-[#d51317] text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-[#a50d12] hover:-translate-y-1 transition-all flex items-center justify-between">
                            Global Search <ArrowRight className="w-5 h-5" />
                        </button>
                        <button onClick={() => navigate('/register')} className="bg-transparent border-2 border-[#d51317] text-[#d51317] px-8 py-4 rounded-full font-bold hover:bg-slate-50 hover:-translate-y-1 transition-all flex items-center justify-between">
                            Join Registry <Activity className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Right Box (Red side) */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 py-20 bg-[#d51317] text-white relative">
                
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="absolute top-10 right-10 lg:top-16 lg:right-20 text-right">
                    <span className="text-4xl lg:text-5xl font-black block">14<sup className="text-2xl font-bold align-super">th</sup> <span className="text-xl font-semibold tracking-widest uppercase ml-1">June</span></span>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-md mt-auto lg:mt-32 xl:pl-20 mx-auto md:mx-0 text-center md:text-left pb-24 md:pb-0">
                    <h2 className="text-[4rem] lg:text-[5.5rem] xl:text-[6.5rem] font-black leading-[0.9] tracking-tighter uppercase text-white drop-shadow-md pb-4">
                        World<br/>
                        Blood<br/>
                        Donor<br/>
                        Day
                    </h2>

                    <div className="md:absolute bottom-10 right-10 lg:bottom-16 lg:right-20 md:text-right mt-16 md:mt-0">
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/90">Give the</p>
                        <p className="text-lg lg:text-xl font-black tracking-[0.2em] uppercase mt-1">Gift of Life</p>
                    </div>
                </motion.div>
            </div>

            {/* Center Visuals (Overlapping nested CSS hearts mimicking paper cut aesthetic) */}
            {/* Wrapper scales down nicely on mobile */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] md:-translate-y-1/2 w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] pointer-events-none z-20 flex items-center justify-center -ml-5 md:-ml-10 scale-75 md:scale-100">
                <div className="relative w-full h-full">
                    
                    {/* Shadow Layer 1 (Darkest, back) */}
                    <HeartLayer scale={1.2} delay={0.1} colorClass="text-[#720a0b]" xOffset="10px" yOffset="10px" zIndex={10} dropShadow="drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]" />
                    
                    {/* Main Background Layer */}
                    <HeartLayer scale={1.2} delay={0.2} colorClass="text-[#a50d12]" zIndex={20} />
                    
                    {/* Floating background extra heart (Top Right) */}
                    <HeartLayer scale={0.4} delay={0.8} colorClass="text-[#960a0f]" rotate="15deg" xOffset="220px" yOffset="-200px" zIndex={15} />

                    {/* Mid Layer */}
                    <HeartLayer scale={0.9} delay={0.4} colorClass="text-[#be1215]" zIndex={30} />
                    
                    {/* Inner Layer */}
                    <HeartLayer scale={0.65} delay={0.6} colorClass="text-[#d51317]" zIndex={40} dropShadow="drop-shadow-lg" />
                    
                    {/* Small extra nested overlapping heart (Top Centerish) */}
                    <HeartLayer scale={0.25} delay={0.9} colorClass="text-[#bd1215]" rotate="-15deg" xOffset="80px" yOffset="-220px" zIndex={45} dropShadow="drop-shadow-xl" />
                    
                    {/* Small extra nested overlapping heart (Bottomish) */}
                    <HeartLayer scale={0.18} delay={1.0} colorClass="text-[#a50d12]" rotate="25deg" xOffset="20px" yOffset="-80px" zIndex={46} dropShadow="drop-shadow-lg" />

                    {/* Central Blood Drop Base */}
                    <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.2, type: "spring", bounce: 0.5 }}
                        className="absolute top-[40%] left-[45%] lg:left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-20 h-20 lg:w-28 lg:h-28 flex items-center justify-center"
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full text-white drop-shadow-xl" fill="currentColor">
                           <path d="M 50 10 C 50 10 20 45 20 65 C 20 81.56 33.43 95 50 95 C 66.56 95 80 81.56 80 65 C 80 45 50 10 50 10 Z" />
                        </svg>
                        {/* Red inner drop with pulse */}
                        <div className="absolute inset-0 flex items-center justify-center pt-[30%]">
                             <Activity className="w-8 h-8 lg:w-12 lg:h-12 text-[#d51317] animate-pulse" strokeWidth={2.5} />
                        </div>
                    </motion.div>
                </div>
            </div>

        </header>

        {/* Minimalist Stats footer to match styling */}
        <section className="relative z-10 bg-slate-900 border-t border-red-900/40 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] py-12">
            <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
                {[
                    { label: "Active Nodes", val: 1250340, suffix: "" },
                    { label: "Countries Live", val: 45, suffix: "" },
                    { label: "API Latency (ms)", val: 12, suffix: "" },
                    { label: "Lives Impacted", val: 890500, suffix: "+" }
                ].map((stat, i) => (
                    <div key={i} className="px-4">
                    <div className="text-3xl lg:text-4xl font-black text-white mb-2">
                        <AnimatedNumber value={stat.val} suffix={stat.suffix} />
                    </div>
                    <div className="text-[#d51317] font-bold uppercase tracking-widest text-xs">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    </motion.div>
  );
};

export default HomePage;
