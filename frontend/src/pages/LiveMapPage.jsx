import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AIPredictorWidget from '../components/AIPredictorWidget';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
  out: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const names = ['John Doe', 'Sarah M.', 'Mike R.', 'Emily W.', 'David B.', 'Lisa K.', 'James T.', 'Alex H.', 'Chloe G.', 'Daniel F.'];

const LiveMapPage = () => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    // Generate robust functional simulated active nodes with donor/patient data
    const simulatedNodes = Array.from({ length: 60 }).map((_, i) => {
      const isUrgent = Math.random() > 0.75;
      return {
        id: i,
        lat: (Math.random() - 0.5) * 140, // Avoid poles
        lng: (Math.random() - 0.5) * 360,
        isUrgent,
        name: names[Math.floor(Math.random() * names.length)],
        bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
        distance: Math.floor(Math.random() * 15) + 1, // 1-15km radius
        contact: '+1-555-' + Math.floor(1000 + Math.random() * 9000)
      };
    });
    
    // Include the main HQ Node
    simulatedNodes.push({ 
        id: 'hq', 
        lat: 22.3072, 
        lng: 73.1812, 
        isUrgent: false, 
        name: "Hemodynamic HQ", 
        bloodType: 'Universal', 
        distance: 0,
        contact: '1-800-DONATE'
    });
    
    setNodes(simulatedNodes);
  }, []);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="py-12 bg-slate-950 rounded-[3rem] mx-4 md:mx-10 my-10 min-h-[85vh] text-white flex flex-col items-center relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="z-20 text-center mb-8 pt-4">
        <h1 className="text-4xl lg:text-5xl font-black mb-4">Live Global Satellite Array</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Monitoring real-time donor availability and urgent recipient requests across grid sectors via our satellite network.</p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center mt-6 text-sm font-bold">
          <span className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-400 backdrop-blur shadow-lg">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Available Donors
          </span>
          <span className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 backdrop-blur shadow-lg">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(225,29,72,0.8)]"></span> Urgent Requests
          </span>
        </div>
      </div>

      <div className="w-full max-w-7xl px-4 lg:px-8 flex-1 flex flex-col md:flex-row gap-6 my-4 min-h-[500px] z-10 relative">
        
        {/* Sidebar Predictor Widget */}
        <div className="w-full md:w-[350px] shrink-0 h-[600px] hidden lg:block">
            <AIPredictorWidget />
        </div>

        {/* Map Area */}
        <div className="w-full h-[600px] flex-1 bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative p-2 md:p-4">
          
          <div className="w-full h-full rounded-[2rem] overflow-hidden">
            <MapContainer center={[20, 0]} zoom={3} className="w-full h-full" zoomControl={true}>
              
              {/* SATELLITE TILE LAYER WITH LABELS (CITIES) */}
              <TileLayer
                attribution='&copy; Google'
                url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              />
              
              {nodes.map(node => (
                <CircleMarker 
                  key={node.id} 
                  center={[node.lat, node.lng]} 
                  radius={node.isUrgent ? 9 : 6}
                  fillColor={node.isUrgent ? '#e11d48' : '#10b981'}
                  color={'#ffffff'}
                  weight={2}
                  fillOpacity={0.9}
                >
                  <Popup className="custom-popup border-0 p-0 m-0">
                    <div className="p-3 min-w-[220px] bg-white rounded-xl shadow-xl font-sans">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${node.isUrgent ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {node.isUrgent ? 'Patient Request' : 'Active Donor'}
                            </span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600">{node.distance}km away</span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-4 mt-2">
                            <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center text-white shadow-md border-2 border-white ${node.isUrgent ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                                <span className="font-black text-lg leading-none">{node.bloodType.replace(/[+-]/g, '')}</span>
                                <span className="text-xs font-bold">{node.bloodType.includes('+') ? 'POS' : node.bloodType.includes('-') ? 'NEG' : ''}</span>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-slate-800 text-base leading-tight">{node.name}</h3>
                                <p className="text-xs text-slate-500 font-mono mt-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 inline-block w-fit">{node.contact}</p>
                            </div>
                        </div>

                        <button className={`w-full py-2.5 rounded-lg text-white font-bold transition-colors text-sm shadow-sm ${node.isUrgent ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                            {node.isUrgent ? 'Dispatch Match' : 'Ping Donor'}
                        </button>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveMapPage;
