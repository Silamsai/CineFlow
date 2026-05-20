import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import MovieCard from '../Movies/MovieCard';
import { movieService } from '../../services';
import { SkeletonCard } from '../Common/LoadingSpinner';

export default function MovieCarousel({ title, fetchFn, queryKey, icon: Icon = Sparkles }) {
  const scrollRef = useRef(null);
  const { data, isLoading } = useQuery({ queryKey: [queryKey], queryFn: fetchFn });
  const movies = data?.data?.data || data?.data || [];

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cinema-gold/20 rounded-lg flex items-center justify-center">
            <Icon className="w-4 h-4 text-cinema-gold" />
          </div>
          <h2 className="section-title text-2xl md:text-3xl">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-cinema-border text-cinema-muted hover:border-cinema-gold hover:text-cinema-gold transition-all flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scroll(1)} className="w-9 h-9 rounded-full border border-cinema-border text-cinema-muted hover:border-cinema-gold hover:text-cinema-gold transition-all flex items-center justify-center">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="flex-shrink-0 w-48"><SkeletonCard /></div>)
          : movies.map((movie, i) => (
              <div key={movie._id} className="flex-shrink-0 w-48 sm:w-52">
                <MovieCard movie={movie} index={i} />
              </div>
            ))
        }
      </div>
    </section>
  );
}
