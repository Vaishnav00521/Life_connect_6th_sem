import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import LiveTicker from '../components/LiveTicker';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';
import SOSButton from '../components/SOSButton';

const MainLayout = () => {
  const location = useLocation();
  
  return (
    <div className="font-sans text-slate-200 bg-slate-950 min-h-screen flex flex-col selection:bg-rose-500 selection:text-white relative">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-950/20 via-slate-950 to-slate-950 z-0"></div>
      <AnimatedBackground />

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#020617', // slate-950 equivalent or darker
            color: '#f8fafc',
            border: '1px solid #1e293b', // slate-800
            fontWeight: 'bold',
            borderRadius: '1rem',
            padding: '16px',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#e11d48', secondary: '#fff' } },
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <LiveTicker />

        <main className="flex-grow pt-[112px]">
          <SOSButton />
          <AnimatePresence mode="wait">
             <React.Fragment key={location.pathname}>
               <Outlet />
             </React.Fragment>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
