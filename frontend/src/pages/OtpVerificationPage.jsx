import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, KeyRound, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/api';

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  in: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50, damping: 15 } },
  out: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const heartbeatTransition = {
  scale: [1, 1.05, 1, 1.05, 1],
  transition: { duration: 0.5 }
};

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const donorId = location.state?.donorId;

  if (!donorId) {
    return (
      <div className="py-20 min-h-screen flex items-center justify-center">
        <div className="bg-rose-950/50 backdrop-blur-xl p-10 rounded-2xl border border-rose-900/50 text-center shadow-xl">
          <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Invalid Session Context</h2>
          <p className="text-rose-400 font-bold">No bio-signature ID found to verify.</p>
        </div>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Cryptographic key must align to 6 constraints.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiFetch(`/api/donors/verify?id=${donorId}&otp=${otp}`, {
        method: 'POST'
      });
      
      const resultText = await response.text();
      
      if (!response.ok) {
        let errorMsg = resultText || "Verification Protocol Failed";
        try {
          const parsed = JSON.parse(resultText);
          if (parsed.error) errorMsg = parsed.error;
        } catch(e) {}
        throw new Error(errorMsg);
      }

      toast.success(resultText || "Bio-Signature successfully verified!", {
        iconTheme: { primary: '#10b981', secondary: '#fff' }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Decryption Failed! Invalid or expired OTP.");
      setLoading(false);
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="py-20 min-h-[85vh] flex justify-center px-6 items-center relative z-10">
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-emerald-900/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400"></div>
        
        <div className="mb-10 text-center relative z-10">
          <div className="w-20 h-20 bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-900 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <KeyRound className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-white">Target Authentication</h1>
          <p className="text-emerald-400/80 mt-3 font-bold text-sm">Please input the 6-digit cryptographic sequence dispatched to your secure comm-link.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-8 relative z-10">
          <div>
            <input 
              type="text" 
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • • • •" 
              className="w-full bg-slate-950 border border-slate-700/50 rounded-xl p-6 focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner text-center font-black text-4xl tracking-[1em] text-emerald-400 placeholder-slate-800" 
            />
          </div>

          <motion.button whileHover={!loading ? heartbeatTransition : {}} type="submit" disabled={loading || otp.length !== 6} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-xl py-5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span> : <><ShieldCheck className="w-6 h-6" /> Evaluate Handshake</>}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default OtpVerificationPage;
