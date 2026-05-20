import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Ticket, ChevronDown, Star, LogIn } from 'lucide-react';
import { gsap } from 'gsap';
import { useAuthContext } from '../../context/AuthContext';

function FilmReel() {
  return (
    <motion.svg viewBox="0 0 300 300" className="w-full h-full"
      animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
      <circle cx="150" cy="150" r="140" fill="none" stroke="#D4AF37" strokeWidth="3" strokeDasharray="8 4" />
      <circle cx="150" cy="150" r="120" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="2" />
      {[0,60,120,180,240,300].map((angle) => (
        <line key={angle} x1="150" y1="150"
          x2={150 + 100 * Math.cos((angle * Math.PI) / 180)}
          y2={150 + 100 * Math.sin((angle * Math.PI) / 180)}
          stroke="#D4AF37" strokeWidth="2" opacity="0.6" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <rect key={i} x={150 + 108 * Math.cos(a) - 6} y={150 + 108 * Math.sin(a) - 4}
          width="12" height="8" rx="2" fill="#0a0a0a" stroke="#D4AF37" strokeWidth="1" />;
      })}
      <circle cx="150" cy="150" r="30" fill="#D4AF37" opacity="0.15" />
      <circle cx="150" cy="150" r="20" fill="#1a1a1a" stroke="#D4AF37" strokeWidth="2" />
      <circle cx="150" cy="150" r="8" fill="#D4AF37" />
      {[0,72,144,216,288].map((angle) => (
        <circle key={angle}
          cx={150 + 45 * Math.cos((angle * Math.PI) / 180)}
          cy={150 + 45 * Math.sin((angle * Math.PI) / 180)}
          r="8" fill="#0a0a0a" stroke="#D4AF37" strokeWidth="1.5" />
      ))}
    </motion.svg>
  );
}

function FloatingTicket({ delay, x, y }) {
  return (
    <motion.div className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [-15, 15, -15], rotate: [-5, 5, -5], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}>
      <div className="w-16 h-8 bg-cinema-gold/20 border border-cinema-gold/40 rounded-md flex items-center justify-center backdrop-blur-sm">
        <Ticket className="w-4 h-4 text-cinema-gold" />
      </div>
    </motion.div>
  );
}

const HERO_STATS = [
  { value: '500+', label: 'Movies' }, { value: '1000+', label: 'Theaters' },
  { value: '5M+', label: 'Happy Users' }, { value: '4.9★', label: 'Rating' },
];
const floatingTickets = [
  { delay: 0, x: 5, y: 20 }, { delay: 1, x: 88, y: 15 },
  { delay: 2, x: 10, y: 70 }, { delay: 0.5, x: 85, y: 65 },
  { delay: 1.5, x: 50, y: 85 }, { delay: 3, x: 30, y: 10 },
];

export default function HeroSection() {
  const { isSignedIn } = useAuthContext();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const SignInButton = window.__clerkModule?.SignInButton ?? null;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.spotlight', { x: '+=50', y: '+=30', duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-cinema-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.08)_0%,transparent_60%)]" />
        <div className="spotlight absolute w-[600px] h-[600px] rounded-full bg-cinema-gold/3 blur-3xl -top-20 -left-20" />
        <div className="absolute w-96 h-96 rounded-full bg-cinema-red/5 blur-3xl bottom-0 right-0" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #D4AF37 40px, #D4AF37 41px)' }} />
      </div>

      {floatingTickets.map((t, i) => <FloatingTicket key={i} {...t} />)}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-0 min-h-screen">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ y, opacity }}>
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-cinema-red animate-pulse" />
              <span className="text-cinema-gold text-xs font-semibold tracking-widest uppercase">Premium Cinema Experience</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
              <span className="text-cinema-off-white">Experience</span><br />
              <span className="gold-text">Cinema</span><br />
              <span className="text-cinema-off-white">Like Never</span><br />
              <span className="text-cinema-red">Before.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-cinema-muted text-lg leading-relaxed mb-8 max-w-md">
              Book tickets for the latest blockbusters, choose your perfect seats, and enjoy the ultimate cinematic experience — all in one seamless platform.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
              <Link to="/movies" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                <Play className="w-5 h-5" /> Browse Movies
              </Link>
              {!isSignedIn ? (
                SignInButton ? (
                  <SignInButton mode="modal">
                    <button className="btn-outline flex items-center gap-2 text-base px-8 py-4">
                      <LogIn className="w-5 h-5" /> Sign In to Book
                    </button>
                  </SignInButton>
                ) : (
                  <Link to="/movies" className="btn-outline flex items-center gap-2 text-base px-8 py-4">
                    <Ticket className="w-5 h-5" /> Book Now
                  </Link>
                )
              ) : (
                <Link to="/my-bookings" className="btn-outline flex items-center gap-2 text-base px-8 py-4">
                  <Ticket className="w-5 h-5" /> My Tickets
                </Link>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
              {HERO_STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-cinema-gold font-bold text-xl font-display">{value}</div>
                  <div className="text-cinema-muted text-xs mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}>
            <div className="absolute inset-0 bg-cinema-gold/5 rounded-full blur-3xl scale-75" />
            <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]">
              <FilmReel />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div className="glass rounded-2xl px-6 py-4 text-center"
                  animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Star className="w-6 h-6 text-cinema-gold mx-auto mb-1 fill-cinema-gold" />
                  <p className="text-cinema-gold font-bold text-lg">4.9 / 5</p>
                  <p className="text-cinema-muted text-xs">User Rating</p>
                </motion.div>
              </div>
            </div>
            {[{ label: 'IMAX', color: 'bg-blue-500', angle: 0 }, { label: '4DX', color: 'bg-purple-500', angle: 120 }, { label: 'Dolby', color: 'bg-cinema-red', angle: 240 }].map(({ label, color, angle }) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <motion.div key={label}
                  className={`absolute glass px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10`}
                  style={{ left: `calc(50% + ${200 * Math.cos(rad)}px)`, top: `calc(50% + ${200 * Math.sin(rad)}px)`, transform: 'translate(-50%, -50%)' }}
                  animate={{ y: [-5, 5, -5] }} transition={{ duration: 3 + angle / 100, repeat: Infinity }}>
                  {label}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cinema-muted"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 text-cinema-gold" />
      </motion.div>
    </section>
  );
}
