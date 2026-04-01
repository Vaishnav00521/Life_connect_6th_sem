import React from 'react';
import { motion } from 'framer-motion';
import { Map, Globe, Phone, Send, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const heartbeatTransition = {
  scale: [1, 1.05, 1, 1.05, 1],
  transition: { duration: 0.5 }
};

const springTransition = { type: "spring", stiffness: 50, damping: 15 };
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: springTransition },
  out: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  details: z.string().min(10, "Please provide more details (min 10 chars)")
});

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data) => {
    console.log("Transmission Data:", data);
    toast.success("Message Transmitted to HQ!");
    reset();
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="py-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Secure Communications</h2>
          <p className="text-slate-400 text-lg font-medium">Need API access for your hospital? Or facing issues with your donor profile? Open a ticket with our command center.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-10">
            <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-slate-800 flex items-start gap-6 hover:shadow-xl hover:border-slate-700 transition-all">
              <div className="bg-rose-950/50 p-4 rounded-2xl border border-rose-900/50"><Map className="w-8 h-8 text-rose-500" /></div>
              <div>
                <h4 className="font-black text-white text-xl">Global Headquarters</h4>
                <p className="text-slate-400 mt-2 font-medium">LifeConnect Command Center<br />Vadodara, Gujarat<br />India 390001</p>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-slate-800 flex items-start gap-6 hover:shadow-xl hover:border-slate-700 transition-all">
              <div className="bg-cyan-950/50 p-4 rounded-2xl border border-cyan-900/50"><Globe className="w-8 h-8 text-cyan-400" /></div>
              <div>
                <h4 className="font-black text-white text-xl">US Infrastructure Hub</h4>
                <p className="text-slate-400 mt-2 font-medium">Tech Park, Silicon Valley<br />San Francisco, CA<br />United States</p>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-slate-800 flex items-start gap-6 hover:shadow-xl hover:border-slate-700 transition-all">
              <div className="bg-emerald-950/50 p-4 rounded-2xl border border-emerald-900/50"><Phone className="w-8 h-8 text-emerald-400" /></div>
              <div>
                <h4 className="font-black text-white text-xl">Emergency Dispatch</h4>
                <p className="text-slate-400 mt-2 font-medium">Toll-Free: +91 1800-123-4567<br />Global: +1 800-LIFENET<br />Available 24/7/365</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-900/20 to-transparent rounded-bl-full"></div>
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3"><Send className="w-6 h-6 text-rose-500" /> Transmit Message</h3>

            <form className="space-y-6 relative z-10" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">First Name</label>
                  <input {...register('firstName')} type="text" className={`w-full bg-slate-800 border ${errors.firstName ? 'border-rose-500 ring-rose-900' : 'border-slate-700'} rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-semibold text-white placeholder-slate-500`} placeholder="John" />
                  {errors.firstName && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Last Name</label>
                  <input {...register('lastName')} type="text" className={`w-full bg-slate-800 border ${errors.lastName ? 'border-rose-500 ring-rose-900' : 'border-slate-700'} rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-semibold text-white placeholder-slate-500`} placeholder="Doe" />
                  {errors.lastName && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Secure Email Address</label>
                <input {...register('email')} type="email" className={`w-full bg-slate-800 border ${errors.email ? 'border-rose-500 ring-rose-900' : 'border-slate-700'} rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all font-semibold text-white placeholder-slate-500`} placeholder="john@hospital.com" />
                {errors.email && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Transmission Details</label>
                <textarea {...register('details')} rows="5" className={`w-full bg-slate-800 border ${errors.details ? 'border-rose-500 ring-rose-900' : 'border-slate-700'} rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none font-semibold text-white placeholder-slate-500`} placeholder="Describe your request or issue..."></textarea>
                {errors.details && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.details.message}</p>}
              </div>
              <motion.button whileHover={heartbeatTransition} type="submit" className="w-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-lg py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] flex items-center justify-center gap-2">
                Send Transmission <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default ContactPage;
