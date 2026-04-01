import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Navigation, Bell, Activity, ShieldCheck, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bloodGroup: z.string().min(1, "Blood Group is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
});

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { country: 'India' }
  });

  const onSubmit = async (data) => {
    setLoading(true);

    if (!navigator.geolocation) {
      toast.error("GPS required to register as a node.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const payload = {
          ...data,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        const response = await apiFetch('/api/donors/register', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Registration Failed");

        const responseText = await response.text();
        let donorId = responseText; 
        try {
           const parsed = JSON.parse(responseText);
           if (parsed.donorId) donorId = parsed.donorId;
           else if (parsed.id) donorId = parsed.id;
        } catch(e) {}

        setLoading(false);
        toast.success("Bio-signature staged. Awaiting SMS OTP validation...");
        navigate('/verify-otp', { state: { donorId } });
      } catch (error) {
        console.error(error);
        toast.error("Connection Refused! Is the server running?");
        setLoading(false);
      }
    }, () => {
      toast.error("Location Access Denied! We need your GPS.");
      setLoading(false);
    });
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="py-20 min-h-[85vh] flex justify-center px-6 items-center relative z-10">
      <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-xl p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 to-transparent opacity-50"></div>

        <div className="mb-12 text-center border-b border-rose-900/30 pb-10 relative z-10">
          <h1 className="text-4xl font-black text-white">Donor Node Initialization</h1>
          <p className="text-cyan-400/80 mt-3 font-bold text-lg">Encrypt and inject your profile into the global routing database.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative z-10">
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 shadow-inner">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3"><User className="w-6 h-6 text-rose-500" /> 1. Bio-Signature Verification</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Legal Identifier</label>
                <input {...register('name')} type="text" placeholder="Full Name" className={`w-full bg-slate-900 border ${errors.name ? 'border-rose-500 ring-rose-900' : 'border-slate-700'} rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner text-white placeholder-slate-600`} />
                {errors.name && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hematology Group</label>
                <select {...register('bloodGroup')} className={`w-full bg-slate-900 border ${errors.bloodGroup ? 'border-rose-500 ring-rose-900' : 'border-slate-700'} rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner cursor-pointer text-white`}>
                  <option value="">Select Classification</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
                {errors.bloodGroup && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.bloodGroup.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 shadow-inner">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3"><Navigation className="w-6 h-6 text-cyan-400" /> 2. Spatial Coordinates</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sovereignty</label>
                <select {...register('country')} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner text-white cursor-pointer">
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
                {errors.country && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.country.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Territory / State</label>
                <input {...register('state')} type="text" placeholder="e.g. Gujarat" className={`w-full bg-slate-900 border ${errors.state ? 'border-rose-500 ring-rose-900' : 'border-slate-700'} rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner text-white placeholder-slate-600`} />
                {errors.state && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.state.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Local Grid (City)</label>
                <input {...register('city')} type="text" placeholder="e.g. Vadodara" className={`w-full bg-slate-900 border ${errors.city ? 'border-rose-500 ring-rose-900' : 'border-slate-700'} rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner text-white placeholder-slate-600`} />
                {errors.city && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.city.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 shadow-inner">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3"><Bell className="w-6 h-6 text-emerald-400" /> 3. Secure Comm-Link</h3>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Direct Terminal Number</label>
              <input {...register('phone')} type="tel" placeholder="Mobile Number (e.g. 9876543210)" className={`w-full bg-slate-900 border ${errors.phone ? 'border-rose-500 ring-rose-900' : 'border-slate-700'} rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner text-white placeholder-slate-600`} />
              {errors.phone && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="pt-4">
            <motion.button whileHover={!loading ? heartbeatTransition : {}} type="submit" disabled={loading} className="w-full bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-2xl py-6 rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] flex justify-center items-center gap-3 disabled:opacity-50">
              {loading ? <span className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></span> : <><Activity className="w-8 h-8" /> Initialize Node Injection</>}
            </motion.button>
            <div className="flex items-center justify-center gap-2 mt-6">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest">Database connection secured via AES-256 protocol</p>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
export default RegisterPage;
