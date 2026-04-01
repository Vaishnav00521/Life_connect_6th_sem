import React from 'react';
import { motion } from 'framer-motion';
import { Syringe, Stethoscope, Truck, HeartHandshake } from 'lucide-react';

const stepIcons = [Syringe, Stethoscope, Truck, HeartHandshake];
const stepNames = ['Collected', 'Lab Tested', 'In Transport', 'Transfused'];

const BloodJourneyTracker = ({ journeyStatus = "Collected" }) => {
  const currentIndex = stepNames.indexOf(journeyStatus);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  const widthPercentage = `${(safeIndex / (stepNames.length - 1)) * 100}%`;

  const dynamicSteps = stepNames.map((name, idx) => ({
    id: idx + 1,
    title: name,
    icon: stepIcons[idx],
    status: idx < safeIndex ? 'completed' : idx === safeIndex ? 'current' : 'pending',
    time: idx < safeIndex ? 'Cleared' : idx === safeIndex ? 'Active' : 'Pending'
  }));

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="mb-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                Live Blood Tracker
            </h2>
            <p className="text-slate-400 mt-2 text-sm">Tracking donation ID: <span className="font-mono text-rose-400">#HMD-994L-X2</span></p>
        </div>

        <div className="relative">
            {/* Background Line */}
            <div className="absolute top-8 left-6 sm:left-[5%] right-[5%] h-1.5 bg-slate-800 rounded-full"></div>
            
            {/* Active Progress Line */}
            <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: widthPercentage }} 
                transition={{ duration: 1.5, ease: "easeInOut" }} 
                className="absolute top-8 left-6 sm:left-[5%] h-1.5 bg-gradient-to-r from-rose-600 to-rose-400 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.6)]"
            ></motion.div>

            <div className="relative flex justify-between items-start w-full">
                {dynamicSteps.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    
                    return (
                        <div key={step.id} className="flex flex-col items-center w-1/4 relative z-10">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={isCurrent ? { 
                                    scale: 1, 
                                    boxShadow: ["0px 0px 0px 0px rgba(225,29,72,0)", "0px 0px 0px 10px rgba(225,29,72,0.2)", "0px 0px 0px 0px rgba(225,29,72,0)"] 
                                } : { scale: 1 }}
                                transition={isCurrent ? {
                                    scale: { delay: idx * 0.3, type: "spring" },
                                    boxShadow: { repeat: Infinity, duration: 2 }
                                } : { delay: idx * 0.3, type: "spring" }}
                                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-4 ${
                                    isCompleted ? 'bg-rose-500 border-slate-900' : 
                                    isCurrent ? 'bg-slate-900 border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 
                                    'bg-slate-800 border-slate-900'
                                } transition-colors duration-500`}
                            >
                                <step.icon className={`w-5 h-5 sm:w-7 sm:h-7 ${
                                    isCompleted ? 'text-white' : 
                                    isCurrent ? 'text-rose-400 animate-pulse' : 
                                    'text-slate-500'
                                }`} />
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (idx * 0.3) + 0.2 }}
                                className="mt-4 text-center"
                            >
                                <h4 className={`text-xs sm:text-sm font-bold ${
                                    isCompleted || isCurrent ? 'text-white' : 'text-slate-500'
                                }`}>{step.title}</h4>
                                <p className="text-[10px] sm:text-xs font-mono text-slate-400 mt-1">{step.time}</p>
                            </motion.div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  );
};

export default BloodJourneyTracker;
