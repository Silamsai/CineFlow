import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizes[size]} text-cinema-gold animate-spin`} />
      {text && <p className="text-cinema-muted text-sm">{text}</p>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-cinema-black flex items-center justify-center">
      <motion.div className="flex flex-col items-center gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-cinema-border" />
          <div className="absolute inset-0 rounded-full border-4 border-t-cinema-gold animate-spin" />
          <div className="absolute inset-3 rounded-full bg-cinema-red/20 flex items-center justify-center">
            <span className="text-cinema-gold font-bold text-lg">CF</span>
          </div>
        </div>
        <p className="text-cinema-muted animate-pulse">Loading CineFlow...</p>
      </motion.div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-[2/3] shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 shimmer rounded w-3/4" />
        <div className="h-3 shimmer rounded w-1/2" />
        <div className="h-8 shimmer rounded" />
      </div>
    </div>
  );
}
