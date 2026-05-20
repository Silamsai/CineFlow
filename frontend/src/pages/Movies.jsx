import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import MovieGrid from '../components/Movies/MovieGrid';

export default function Movies() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [inputValue, setInputValue] = useState(initialSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue);
  };

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="section-title mb-2">All Movies</h1>
          <p className="text-cinema-muted">Discover and book tickets for the latest releases</p>
        </motion.div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cinema-muted" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search movies, genres, actors..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>

        <MovieGrid searchQuery={searchQuery} />
      </div>
    </main>
  );
}
