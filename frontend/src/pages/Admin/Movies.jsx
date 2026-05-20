import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2, Trash2, Save, Image, Upload, Star, Flame, Sparkles, CheckCircle, Loader2, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { movieService } from '../../services';
import toast from 'react-hot-toast';

const GENRES_LIST  = ['Action','Adventure','Comedy','Drama','Fantasy','Horror','Mystery','Romance','Sci-Fi','Thriller','War','Animation','Historical','Mythology','Sports'];
const FORMAT_LIST  = ['2D','3D','IMAX','4DX','Dolby','ICE'];
const LANG_LIST    = ['Hindi','English','Tamil','Telugu','Kannada','Malayalam','Bengali','Punjabi'];
const CERT_LIST    = ['U','UA','A','S','PG-13'];

const EMPTY_FORM = {
  title: '', description: '', director: '', cast: '',
  posterUrl: '', bannerUrl: '', certificate: 'UA',
  duration: '', genre: [], format: ['2D'], language: ['Hindi'],
  averageRating: '', votes: '0', isHot: false, isNew: true, isHouseFull: false, isComingSoon: false,
  releaseDate: new Date().toISOString().split('T')[0],
};

function MultiSelect({ label, options, value = [], onChange }) {
  return (
    <div>
      <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button key={opt} type="button"
            onClick={() => onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt])}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${value.includes(opt) ? 'bg-cinema-red border-cinema-red text-white' : 'border-cinema-border text-cinema-muted hover:border-cinema-red/50 hover:text-cinema-off-white'}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function inp(cls = '') { return `w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cinema-red transition-colors ${cls}`; }

function MovieModal({ movie, onClose, onSave }) {
  const [form, setForm] = useState(movie ? {
    ...movie,
    cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : (movie.cast || ''),
    releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  } : { ...EMPTY_FORM });
  const [previewUrl, setPreviewUrl] = useState(form.posterUrl || '');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      set('posterUrl', url);
      setPreviewUrl(url);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    const data = {
      ...form,
      cast: form.cast ? form.cast.split(',').map(s => s.trim()).filter(Boolean) : [],
      duration: form.duration ? Number(form.duration) : undefined,
      averageRating: form.averageRating ? Number(form.averageRating) : 0,
    };
    try {
      await onSave(data);
    } catch (err) {
      // Handled inside calling component
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[200] flex items-start justify-center px-4 py-6 overflow-y-auto"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-cinema-dark border border-cinema-border rounded-2xl w-full max-w-2xl shadow-2xl my-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-cinema-border">
          <h2 className="font-display text-lg font-bold text-cinema-off-white">
            {movie ? `Edit: ${movie.title}` : 'Add New Movie'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid md:grid-cols-3 gap-5">
            {/* Poster */}
            <div className="md:col-span-1">
              <Field label="Movie Poster">
                <div className="relative aspect-[2/3] bg-cinema-black border-2 border-dashed border-cinema-border rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:border-cinema-red/50 transition-colors"
                  onClick={() => fileRef.current?.click()}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover"
                      onError={() => setPreviewUrl('')} />
                  ) : (
                    <div className="text-center p-4">
                      <Image className="w-8 h-8 text-cinema-muted mx-auto mb-2" />
                      <p className="text-cinema-muted text-xs">Click to upload</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <input type="text" value={form.posterUrl} onChange={e => { set('posterUrl', e.target.value); setPreviewUrl(e.target.value); }}
                  placeholder="Or paste image URL..." className={`${inp()} mt-2 text-xs`} />
              </Field>
            </div>

            {/* Core fields */}
            <div className="md:col-span-2 space-y-4">
              <Field label="Movie Title *">
                <input type="text" required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Avengers: Doomsday" className={inp()} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Director">
                  <input type="text" value={form.director} onChange={e => set('director', e.target.value)} placeholder="Director name" className={inp()} />
                </Field>
                <Field label="Duration (min)">
                  <input type="number" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="150" className={inp()} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rating /10">
                  <input type="number" step="0.1" min="0" max="10" value={form.averageRating} onChange={e => set('averageRating', e.target.value)} placeholder="8.5" className={inp()} />
                </Field>
                <Field label="Certificate">
                  <select value={form.certificate} onChange={e => set('certificate', e.target.value)} className={inp()}>
                    {CERT_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Cast (comma separated)">
                <input type="text" value={form.cast} onChange={e => set('cast', e.target.value)} placeholder="Actor 1, Actor 2, Actor 3" className={inp()} />
              </Field>
              <Field label="Release Date">
                <input type="date" value={form.releaseDate} onChange={e => set('releaseDate', e.target.value)} className={inp()} />
              </Field>
            </div>
          </div>

          <Field label="Description / Synopsis">
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Brief synopsis of the movie..." className={`${inp()} resize-none`} />
          </Field>

          <MultiSelect label="Genre" options={GENRES_LIST} value={form.genre} onChange={v => set('genre', v)} />
          <MultiSelect label="Format" options={FORMAT_LIST} value={form.format} onChange={v => set('format', v)} />
          <MultiSelect label="Languages" options={LANG_LIST} value={form.language} onChange={v => set('language', v)} />

          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isHot} onChange={e => set('isHot', e.target.checked)} className="accent-cinema-red w-4 h-4" />
              <Flame className="w-4 h-4 text-cinema-red" />
              <span className="text-cinema-off-white text-sm">Mark as Hot/Trending</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isNew} onChange={e => set('isNew', e.target.checked)} className="accent-cinema-red w-4 h-4" />
              <Sparkles className="w-4 h-4 text-cinema-red" />
              <span className="text-cinema-off-white text-sm">Mark as New</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer border border-yellow-500/30 bg-yellow-500/5 px-2.5 py-1.5 rounded-lg">
              <input type="checkbox" checked={form.isComingSoon} onChange={e => set('isComingSoon', e.target.checked)} className="accent-yellow-500 w-4 h-4" />
              <Calendar className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider">Coming Soon</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer border border-cinema-red/30 bg-cinema-red/5 px-2.5 py-1.5 rounded-lg">
              <input type="checkbox" checked={form.isHouseFull} onChange={e => set('isHouseFull', e.target.checked)} className="accent-cinema-red w-4 h-4" />
              <CheckCircle className="w-4 h-4 text-cinema-red" />
              <span className="text-cinema-red text-xs font-bold uppercase tracking-wider">House Full Board</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-cinema-border text-cinema-muted rounded-xl hover:text-cinema-off-white transition-all text-sm">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-cinema-red hover:bg-cinema-red-dark text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : (movie ? 'Save Changes' : 'Add Movie')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function AdminMovies() {
  const [modal, setModal] = useState(null); // null | 'add' | movie object
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data: moviesRes, isLoading, refetch } = useQuery({
    queryKey: ['adminMovies'],
    queryFn: () => movieService.getAll({ limit: 100 }),
  });

  const movies = useMemo(() => moviesRes?.data?.data || [], [moviesRes]);

  const handleSave = async (data) => {
    try {
      if (modal === 'add') {
        await movieService.create(data);
        toast.success(`"${data.title}" added successfully.`);
      } else {
        await movieService.update(modal._id, data);
        toast.success(`"${data.title}" updated successfully.`);
      }
      refetch();
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving movie');
      throw err;
    }
  };

  const handleDelete = async (id, title) => {
    try {
      await movieService.delete(id);
      toast.success(`"${title}" deleted successfully.`);
      refetch();
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting movie');
    }
  };

  const filtered = useMemo(() => {
    return movies.filter(m => m.title?.toLowerCase().includes(search.toLowerCase()));
  }, [movies, search]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-cinema-muted">
        <Loader2 className="w-10 h-10 text-cinema-red animate-spin mb-4" />
        <p className="text-sm font-semibold uppercase tracking-wider">Loading movies database...</p>
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence>
        {modal !== null && (
          <MovieModal movie={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />
        )}
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="bg-cinema-dark border border-cinema-border rounded-2xl p-6 max-w-sm w-full">
              <h3 className="font-display text-lg font-bold text-cinema-off-white mb-2">Delete Movie?</h3>
              <p className="text-cinema-muted text-sm mb-5">Are you sure you want to delete <strong className="text-cinema-off-white">"{deleteConfirm.title}"</strong>? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-cinema-border text-cinema-muted rounded-lg text-sm hover:text-cinema-off-white">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm._id, deleteConfirm.title)}
                  className="flex-1 py-2 bg-cinema-red text-white rounded-lg text-sm font-bold">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-cinema-off-white">Movie Management</h1>
          <p className="text-cinema-muted text-sm mt-1">{movies.length} movies • Changes appear instantly on homepage</p>
        </div>
        <button onClick={() => setModal('add')}
          className="bg-cinema-red hover:bg-cinema-red-dark text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Movie
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-cinema-red/10 border border-cinema-red/30 rounded-xl p-3 mb-5 flex items-center gap-2 text-sm">
        <CheckCircle className="w-4 h-4 text-cinema-red flex-shrink-0" />
        <span className="text-cinema-muted">All edits (poster, title, details) are saved in the database and <strong className="text-cinema-off-white">reflected immediately on the homepage and movie pages</strong> for all users.</span>
      </div>

      {/* Search */}
      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search movies..." className="w-full max-w-xs bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cinema-red mb-5" />

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cinema-dark">
              <tr className="text-cinema-muted text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Movie</th>
                <th className="px-4 py-3 text-left">Genre</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Format</th>
                <th className="px-4 py-3 text-left">Tags</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cinema-border">
              {filtered.map(m => (
                <tr key={m._id} className="hover:bg-cinema-card/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={m.posterUrl} alt={m.title}
                        className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                        onError={e => { e.target.src = `https://placehold.co/40x56/1a1a1a/E50914?text=${encodeURIComponent(m.title?.[0] || 'M')}`; }} />
                      <div>
                        <p className="text-cinema-off-white font-semibold">{m.title}</p>
                        <p className="text-cinema-muted text-xs">{m.certificate} • {m.language?.join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-cinema-muted text-xs">{m.genre?.slice(0,2).join(', ')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-cinema-red fill-cinema-red" />
                      <span className="text-cinema-off-white font-bold text-xs">{m.averageRating || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">{m.format?.map(f => <span key={f} className="text-[10px] border border-cinema-border px-1.5 py-0.5 rounded text-cinema-muted">{f}</span>)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {m.isComingSoon && <span className="text-[10px] bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded font-semibold uppercase">Soon</span>}
                      {m.isHouseFull && <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-semibold uppercase animate-pulse">House Full</span>}
                      {m.isHot && <span className="text-[10px] bg-cinema-red/20 text-cinema-red px-1.5 py-0.5 rounded font-semibold">Hot</span>}
                      {m.isNew && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-semibold">New</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setModal(m)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 border border-cinema-border text-cinema-muted hover:text-cinema-off-white hover:border-cinema-red rounded-lg transition-all">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(m)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 border border-cinema-red/40 text-cinema-red hover:bg-cinema-red/10 rounded-lg transition-all">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-cinema-muted">No movies found.</div>}
        </div>
      </div>
    </div>
  );
}
