import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';


import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import ContactPage from './pages/ContactPage';
import FindBloodPage from './pages/FindBloodPage';
import DonorListPage from './pages/DonorListPage';
import RegisterPage from './pages/RegisterPage';
import LiveMapPage from './pages/LiveMapPage';
import CommandCenterPage from './pages/CommandCenterPage';
import OtpVerificationPage from './pages/OtpVerificationPage';

// New Premium Pages
import DonorDashboardPage from './pages/DonorDashboardPage';
import OrganNodePage from './pages/OrganNodePage';
import HospitalHubPage from './pages/HospitalHubPage';
import AnalyticsNodePage from './pages/AnalyticsNodePage';

const App = () => {
  useEffect(() => {
    const rawSocketUrl = import.meta.env.VITE_WS_BASE_URL || import.meta.env.VITE_API_BASE_URL;
    const safeSocketUrl = rawSocketUrl.replace(/^wss?:\/\//, function(match) {
      return match === 'wss://' ? 'https://' : 'http://';
    });
    
    // Append the explicit STOMP endpoint path
    const finalUrl = safeSocketUrl.endsWith('/ws-lifeconnect') ? safeSocketUrl : `${safeSocketUrl}/ws-lifeconnect`;
    const socket = new SockJS(finalUrl);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to Hemodynamic WebSocket Grid');
        client.subscribe('/topic/alerts', (message) => {
          if (message.body) {
            toast.custom((t) => (
              <div 
                className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
                  max-w-md w-full bg-rose-950/90 backdrop-blur-xl border-2 border-rose-500 shadow-[0_0_50px_rgba(225,29,72,0.8)] rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <AlertTriangle className="h-10 w-10 text-rose-500 animate-pulse" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-xl font-black text-white tracking-widest uppercase mb-1">
                        Global Dispatch Alert
                      </p>
                      <p className="text-sm font-bold text-rose-200">
                        {message.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ), { duration: 10000 });
          }
        });
      }
    });

    client.activate();
    return () => client.deactivate();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="search" element={<FindBloodPage />} />
          <Route path="donors" element={<DonorListPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-otp" element={<OtpVerificationPage />} />
          <Route path="map" element={<LiveMapPage />} />
          <Route path="admin" element={<CommandCenterPage />} />
          
          {/* Enhanced Enterprise Routes */}
          <Route path="dashboard" element={<DonorDashboardPage />} />
          <Route path="organ-node" element={<OrganNodePage />} />
          <Route path="hospital-hub" element={<HospitalHubPage />} />
          <Route path="analytics" element={<AnalyticsNodePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;