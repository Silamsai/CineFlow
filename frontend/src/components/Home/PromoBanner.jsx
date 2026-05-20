import { motion } from 'framer-motion';
import { Ticket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export default function PromoBanner() {
  const { isSignedIn } = useAuthContext();
  const SignInButton = window.__clerkModule?.SignInButton ?? null;

  return (
    <section className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-cinema-gold/30"
        style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #0a0a0a 40%, #1a0500 100%)' }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="absolute right-0 top-0 w-64 h-64 bg-cinema-gold/10 rounded-full blur-3xl" />

        <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-cinema-gold/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Ticket className="w-8 h-8 text-cinema-gold" />
            </div>
            <div>
              <p className="text-cinema-gold text-xs font-semibold uppercase tracking-widest mb-1">Limited Time Offer</p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-cinema-off-white">Get 20% Off Your First Booking!</h3>
              <p className="text-cinema-muted mt-1 text-sm">Use code <span className="text-cinema-gold font-mono font-bold">CINEFLOW20</span> at checkout</p>
            </div>
          </div>

          {!isSignedIn && SignInButton ? (
            <SignInButton mode="modal">
              <button className="btn-gold flex items-center gap-2 flex-shrink-0 px-8 py-4">
                Claim Offer <ArrowRight className="w-5 h-5" />
              </button>
            </SignInButton>
          ) : (
            <Link to="/movies" className="btn-gold flex items-center gap-2 flex-shrink-0 px-8 py-4">
              Browse Movies <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </motion.div>
    </section>
  );
}
