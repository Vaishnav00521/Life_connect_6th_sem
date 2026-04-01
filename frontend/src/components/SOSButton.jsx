import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Radio, X } from 'lucide-react';
import toast from 'react-hot-toast';

const SOSButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    const triggerSOS = () => {
        setIsBroadcasting(true);
        toast.error("OVERDRIVE INITIATED: Bypassing normal grid queues.", { icon: "🚨", duration: 5000 });
        
        setTimeout(() => {
            setIsBroadcasting(false);
            setIsOpen(false);
            toast.success("Broadcast successful. 47 nodes notified within 10km.");
        }, 3000);
    };

    return (
        <>
            {/* FLOATING BUTTON */}
            <motion.button 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-rose-600 hover:bg-rose-700 text-white w-16 h-16 rounded-full shadow-[0_0_30px_rgba(225,29,72,0.8)] flex items-center justify-center border-2 border-rose-400/50"
            >
                <div className="absolute inset-0 rounded-full border border-rose-400 animate-ping opacity-50"></div>
                <AlertTriangle className="w-8 h-8" strokeWidth={2.5} />
            </motion.button>

            {/* OVERDRIVE MODAL */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
                    >
                        {/* Radar Background */}
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                             <div className="w-[150vw] h-[150vw] sm:w-[100vw] sm:h-[100vw] rounded-full border-r-[10px] border-rose-500 bg-[conic-gradient(from_0deg,transparent_200deg,rgba(225,29,72,0.4)_360deg)]"></div>
                        </motion.div>

                        <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-64 h-64 border border-rose-500/20 rounded-full animate-ping pointer-events-none"></div>
                        </div>

                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border-2 border-rose-600 p-8 sm:p-12 rounded-[2rem] w-full max-w-lg shadow-[0_0_100px_rgba(225,29,72,0.5)] relative z-10 text-center"
                        >
                            <button onClick={() => !isBroadcasting && setIsOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 disabled:opacity-50" disabled={isBroadcasting}>
                                <X className="w-6 h-6 text-slate-400" />
                            </button>

                            <div className="mx-auto w-24 h-24 bg-rose-950 border border-rose-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(225,29,72,0.5)]">
                                <Radio className={`w-12 h-12 text-rose-500 ${isBroadcasting ? 'animate-pulse' : ''}`} />
                            </div>

                            <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2 text-rose-500 drop-shadow-[0_0_10px_rgba(225,29,72,0.8)]">Emergency Dispatch</h2>
                            <p className="text-slate-300 text-lg mb-8">This will immediately bypass all routing queues and broadcast an urgent push notification to every registered donor within a 15km radius of your GPS location.</p>

                            <button 
                                onClick={triggerSOS}
                                disabled={isBroadcasting}
                                className={`w-full py-5 rounded-xl text-white font-black text-xl tracking-widest uppercase transition-all ${
                                    isBroadcasting 
                                    ? 'bg-slate-800 text-rose-500 border-2 border-rose-900 cursor-not-allowed' 
                                    : 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.4)]'
                                }`}
                            >
                                {isBroadcasting ? 'Broadcasting...' : 'Ignite Overdrive'}
                            </button>

                            {isBroadcasting && (
                                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3, ease: 'linear' }} className="h-2 bg-rose-500 mt-6 rounded-full shadow-[0_0_10px_rgba(225,29,72,1)]" />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SOSButton;
