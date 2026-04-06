import React, { useEffect, useRef, useCallback } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, HeartPulse, Search, Zap } from 'lucide-react';

/* ═══════════ Animated Counter ═══════════ */
const AnimatedNumber = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const sv = useSpring(mv, { damping: 30, stiffness: 50 });
  const [d, setD] = React.useState(0);
  useEffect(() => { if (isInView) mv.set(value); }, [isInView, value, mv]);
  useEffect(() => sv.on("change", v => setD(Intl.NumberFormat('en-US').format(Math.floor(v)))), [sv]);
  return <span ref={ref}>{d}{suffix}</span>;
};

/* ═══════════ LEFT PANEL — Floating Blood Cells Canvas ═══════════ */
const FloatingCellsCanvas = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, cells = [];

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = Array.from({ length: 18 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 8 + 4,
        vy: -(Math.random() * 0.3 + 0.1),
        vx: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.12 + 0.04,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, w, h);
      cells.forEach(c => {
        c.x += c.vx; c.y += c.vy;
        if (c.y < -20) { c.y = h + 20; c.x = Math.random() * w; }
        if (c.x < -20) c.x = w + 20;
        if (c.x > w + 20) c.x = -20;
        const pulse = Math.sin(t * 2 + c.phase) * 0.3 + 0.7;
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r * 1.5);
        grad.addColorStop(0, `rgba(213,19,23,${c.opacity * pulse * 1.5})`);
        grad.addColorStop(0.6, `rgba(213,19,23,${c.opacity * pulse * 0.6})`);
        grad.addColorStop(1, `rgba(213,19,23,0)`);
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r * (1 + Math.sin(t + c.phase) * 0.15), 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

/* ═══════════ RIGHT PANEL — Holographic Network Canvas ═══════════ */
const HolographicCanvas = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const nodesRef = useRef([]);

  const init = useCallback((w, h) => {
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.35 + 0.1,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.6 ? 'teal' : Math.random() > 0.4 ? 'purple' : 'white',
    }));
    const nodes = Array.from({ length: 8 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 4 + 2.5,
      pulsePhase: Math.random() * Math.PI * 2,
      orbitR: Math.random() * 30 + 15,
      orbitSpeed: (Math.random() - 0.5) * 0.008,
      baseX: Math.random() * w, baseY: Math.random() * h,
    }));
    return { particles, nodes };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const { particles, nodes } = init(w, h);
      particlesRef.current = particles;
      nodesRef.current = nodes;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const colorMap = { teal: [0, 210, 200], purple: [160, 100, 220], white: [255, 255, 255] };

    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, w, h);
      const hb = Math.pow(Math.sin(t * 1.6) * 0.5 + 0.5, 3);
      const cx = w / 2, cy = h / 2;

      // Holographic radial beams
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t * 0.3;
        const len = 180 + hb * 60;
        const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
        grad.addColorStop(0, `rgba(0,210,200,${0.03 + hb * 0.02})`);
        grad.addColorStop(0.5, `rgba(160,100,220,${0.015 + hb * 0.01})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle - 0.08) * len, cy + Math.sin(angle - 0.08) * len);
        ctx.lineTo(cx + Math.cos(angle + 0.08) * len, cy + Math.sin(angle + 0.08) * len);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Particles
      const ps = particlesRef.current;
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      });

      // Connections
      const maxD = 100;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxD) {
            const a = (1 - d / maxD) * 0.1 * (1 + hb * 0.5);
            const [r, g, b] = colorMap[ps[i].color];
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      ps.forEach(p => {
        const glow = Math.sin(t * 2 + p.phase) * 0.2 + 0.8;
        const a = p.alpha * glow * (1 + hb * 0.3);
        const [r, g, b] = colorMap[p.color];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + hb * 0.15), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fill();
        if (p.r > 1.6) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.06})`;
          ctx.fill();
        }
      });

      // Network nodes (pulsing orbs)
      nodesRef.current.forEach(n => {
        const pulse = Math.sin(t * 1.8 + n.pulsePhase) * 0.5 + 0.5;
        n.x = n.baseX + Math.cos(t * n.orbitSpeed * 50 + n.pulsePhase) * n.orbitR;
        n.y = n.baseY + Math.sin(t * n.orbitSpeed * 50 + n.pulsePhase) * n.orbitR;
        if (n.x < 0) n.x += w; if (n.x > w) n.x -= w;
        if (n.y < 0) n.y += h; if (n.y > h) n.y -= h;

        // Outer glow
        const g1 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        g1.addColorStop(0, `rgba(0,210,200,${0.06 * pulse * (1 + hb * 0.4)})`);
        g1.addColorStop(1, 'rgba(0,210,200,0)');
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = g1; ctx.fill();

        // Core
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.3 + pulse * 0.4})`;
        ctx.fill();
      });

      // Heartbeat ripple from center
      if (hb > 0.35) {
        const rr = (hb - 0.35) * 300;
        const ra = (1 - (hb - 0.35) / 0.65) * 0.06;
        ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,210,200,${ra})`; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, rr * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(160,100,220,${ra * 0.6})`; ctx.lineWidth = 1; ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, [init]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};


/* ═══════════ HOMEPAGE ═══════════ */
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="relative min-h-screen flex flex-col pt-16 overflow-x-hidden"
      style={{ fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Split BG */}
      <div className="absolute inset-x-0 top-0 bottom-0 z-0 flex flex-col md:flex-row pointer-events-none">
        <div className="flex-1 bg-[#fafafa]" />
        <div className="flex-1" style={{
          background: 'linear-gradient(135deg, #c41216 0%, #d51317 40%, #a80e11 100%)'
        }} />
      </div>

      {/* ════════════ HERO ════════════ */}
      <header className="relative z-10 flex-1 flex flex-col md:flex-row w-full min-h-[85vh]">

        {/* ═══ LEFT — Information + CTA ═══ */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-16 md:py-20 bg-[#fafafa] relative overflow-hidden">
          <FloatingCellsCanvas />

          {/* Soft network map hint */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, rgba(0,180,170,0.4) 0px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(213,19,23,0.3) 0px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />

          <motion.div
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
            className="max-w-xl mx-auto md:ml-auto md:mr-8 lg:mr-16 text-center md:text-left relative z-10"
          >
            {/* Headline */}
            <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4.2rem] font-black text-[#b81114] leading-[0.9] tracking-[-0.035em] uppercase">
              Let's Donate<br />Blood &<br />Save Lives
            </h1>

            {/* Sub-copy */}
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-5 text-slate-500 text-sm lg:text-[0.95rem] leading-relaxed max-w-[340px] mx-auto md:mx-0"
            >
              Join the world's most advanced decentralized blood map.
              Donating blood is simple, safe, and saves real lives.
              Help save a life today.
            </motion.p>

            {/* Glass card with slogan */}
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-7 max-w-[380px] mx-auto md:mx-0 p-5 rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(213,19,23,0.08)]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,240,240,0.7) 100%)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d51317] to-[#a50d12] flex items-center justify-center shadow-md">
                  <HeartPulse className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold text-[#d51317]/60 uppercase tracking-[0.2em]">Our Mission</span>
              </div>
              <p className="text-[#b81114] font-extrabold text-base lg:text-lg italic leading-snug">
                "Share a heartbeat. Save a life. Become a donor."
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.5 }}
              className="mt-9 flex flex-col sm:flex-row gap-3.5 max-w-[380px] mx-auto md:mx-0 relative z-50"
            >
              <button onClick={() => navigate('/search')}
                className="group flex-1 text-white px-7 py-4 rounded-2xl font-extrabold text-sm tracking-wide shadow-[0_8px_30px_rgba(213,19,23,0.3)] hover:shadow-[0_14px_45px_rgba(213,19,23,0.45)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2.5"
                style={{ background: 'linear-gradient(135deg, #d51317 0%, #a50d10 100%)' }}
              >
                <Search className="w-4 h-4" /> Global Search <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/register')}
                className="group flex-1 px-7 py-4 rounded-2xl font-extrabold text-sm tracking-wide transition-all flex items-center justify-center gap-2.5 hover:-translate-y-1 active:translate-y-0 border-2 border-[#d51317]/30 text-[#d51317] shadow-[0_0_20px_rgba(213,19,23,0.08)] hover:shadow-[0_0_30px_rgba(213,19,23,0.15)] hover:border-[#d51317]/50"
                style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
              >
                <Zap className="w-4 h-4" /> Join Registry <Activity className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>

            {/* 24/7 badge */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.5 }}
              className="mt-7 flex items-center gap-2.5 justify-center md:justify-start"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-slate-400 tracking-[0.18em] uppercase">
                Available 24/7 · Always Saving Lives
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* ═══ RIGHT — Visual Panel ═══ */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden py-16 md:py-0 min-h-[55vh] md:min-h-0"
          style={{ background: 'linear-gradient(135deg, #c41216 0%, #d51317 40%, #a80e11 100%)' }}
        >
          {/* Circulatory etchings texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q45 20 30 35 Q15 20 30 5' fill='none' stroke='white' stroke-width='0.5'/%3E%3Ccircle cx='15' cy='45' r='4' fill='none' stroke='white' stroke-width='0.3'/%3E%3Ccircle cx='45' cy='50' r='3' fill='none' stroke='white' stroke-width='0.3'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />

          {/* Holographic Network Canvas */}
          <HolographicCanvas />

          {/* Radial center glow */}
          <div className="absolute inset-0 pointer-events-none z-[1]" style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(0,210,200,0.06) 0%, rgba(160,100,220,0.03) 30%, transparent 60%)'
          }} />

          {/* ★ CENTRAL HEART GRAPHIC ★ */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.4, delay: 0.3 }}
            className="relative z-10 w-[250px] h-[250px] sm:w-[290px] sm:h-[290px] md:w-[330px] md:h-[330px] lg:w-[400px] lg:h-[400px] xl:w-[460px] xl:h-[460px]"
          >
            <div className="relative w-full h-full">
              {/* Holographic outer ring */}
              <motion.div
                className="absolute -inset-[15%] rounded-full pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(0,210,200,0.08), rgba(160,100,220,0.06), rgba(213,19,23,0.04), rgba(0,210,200,0.08))',
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              {/* Pulse rings */}
              <motion.div className="absolute -inset-[6%] rounded-full border border-white/10 pointer-events-none"
                animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div className="absolute -inset-[12%] rounded-full border border-teal-400/10 pointer-events-none"
                animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              />
              <motion.div className="absolute -inset-[20%] rounded-full border border-purple-400/5 pointer-events-none"
                animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0, 0.15] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              />

              {/* Teal + purple glow haze */}
              <div className="absolute -inset-16 rounded-full pointer-events-none opacity-40 blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(0,200,190,0.15) 0%, rgba(160,100,220,0.08) 40%, transparent 70%)' }}
              />

              {/* Heart image — heartbeat animation (only the heart pumps, no box) */}
              <motion.img
                src="/hero-heart.png"
                alt="LifeConnect — Saving lives 24/7"
                className="w-full h-full object-contain"
                style={{
                  filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.3)) drop-shadow(0 0 20px rgba(0,200,190,0.1))',
                  background: 'transparent',
                }}
                animate={{
                  scale: [1, 1.06, 1, 1.07, 1],
                }}
                transition={{
                  duration: 1.8, repeat: Infinity, ease: "easeInOut",
                  times: [0, 0.15, 0.35, 0.45, 1],
                }}
              />

              {/* Subtle light emission synced with heartbeat */}
              <motion.div
                className="absolute inset-[20%] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }}
                animate={{ opacity: [0.3, 0.8, 0.3, 0.9, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.35, 0.45, 1] }}
              />
            </div>
          </motion.div>

          {/* Small floating info badges */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5, duration: 0.6 }}
            className="absolute top-[12%] right-[8%] z-20 hidden lg:block"
          >
            <div className="px-3 py-2 rounded-xl border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest"
              style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse" />
              Network Active
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.8, duration: 0.6 }}
            className="absolute bottom-[12%] left-[8%] z-20 hidden lg:block"
          >
            <div className="px-3 py-2 rounded-xl border border-white/10 text-[10px] font-bold text-white/60 uppercase tracking-widest"
              style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block mr-1.5 animate-pulse" />
              24/7 Service
            </div>
          </motion.div>
        </div>

      </header>

      {/* ──── Stats ──── */}
      <section className="relative z-10 bg-slate-900 border-t border-red-900/40 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] py-10 sm:py-12">
        <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { label: "People Ready to Help", val: 1250340 },
            { label: "Countries Connected", val: 45 },
            { label: "Speed (milliseconds)", val: 12 },
            { label: "Lives Touched", val: 890500, suffix: "+" },
          ].map((s, i) => (
            <div key={i} className="px-2 sm:px-4 border-r border-slate-800 last:border-r-0">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1.5">
                <AnimatedNumber value={s.val} suffix={s.suffix || ""} />
              </div>
              <div className="text-[#d51317] font-bold uppercase tracking-[0.15em] text-[10px] sm:text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

    </motion.div>
  );
};

export default HomePage;
