import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, Edit2, Trash2, X, Save, Monitor, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { theaterService } from '../../services';
import toast from 'react-hot-toast';

const FORMATS = ['2D', '3D', 'IMAX', '4DX', 'Dolby'];
const EMPTY = { name: '', city: '', address: '', screens: 5, formats: ['2D'], isActive: true };

function TheaterModal({ theater, onClose, onSave }) {
  const [form, setForm] = useState(theater ? {
    ...theater,
    address: theater.location || theater.address || ''
  } : EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleFmt = (f) => set('formats', form.formats?.includes(f) ? form.formats.filter(x => x !== f) : [...(form.formats || []), f]);

  const handleSaveClick = async () => {
    if (!form.name || !form.city) {
      toast.error('Name and City required');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save theater');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center px-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        className="bg-cinema-dark border border-cinema-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-cinema-off-white">{theater ? 'Edit Theater' : 'Add Theater'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-cinema-muted hover:text-cinema-off-white" /></button>
        </div>
        <div className="space-y-4">
          {[['Theater Name', 'name', 'PVR IMAX...'], ['City', 'city', 'Mumbai'], ['Address (Location)', 'address', 'Mall Name, Area']].map(([lbl, key, ph]) => (
            <div key={key}>
              <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">{lbl}</label>
              <input value={form[key] || ''} onChange={e => set(key, e.target.value)} placeholder={ph}
                className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cinema-red" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Screens</label>
              <input type="number" min="1" max="20" value={form.screens?.length || form.screens || 5} onChange={e => set('screens', Number(e.target.value))}
                disabled={!!theater}
                className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cinema-red disabled:opacity-50" />
            </div>
            <div>
              <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Status</label>
              <select value={form.isActive ? 'active' : 'inactive'} onChange={e => set('isActive', e.target.value === 'active')}
                className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cinema-red">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-cinema-border text-cinema-muted rounded-xl text-sm hover:text-cinema-off-white">Cancel</button>
          <button onClick={handleSaveClick} disabled={saving}
            className="flex-1 bg-cinema-red hover:bg-cinema-red-dark text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminTheaters() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null);

  const { data: theatersRes, isLoading } = useQuery({
    queryKey: ['adminTheaters'],
    queryFn: () => theaterService.getAll({ limit: 100 }).then(res => res.data),
  });

  const theaters = theatersRes?.data || [];

  const handleSave = async (data) => {
    if (modal === 'add') {
      const numScreens = typeof data.screens === 'number' ? data.screens : 5;
      const screensPayload = Array.from({ length: numScreens }, (_, i) => ({
        name: `Screen ${i + 1}`,
        totalSeats: 100,
        rows: 10,
        columns: 10,
        pricing: { standard: 150, premium: 250, vip: 400 }
      }));

      const payload = {
        name: data.name,
        city: data.city,
        location: data.address || '',
        screens: screensPayload,
        isActive: data.isActive
      };
      await theaterService.create(payload);
      toast.success('Theater added successfully.');
    } else {
      const payload = {
        name: data.name,
        city: data.city,
        location: data.address || data.location || '',
        isActive: data.isActive
      };
      await theaterService.update(data._id, payload);
      toast.success('Theater details updated.');
    }
    queryClient.invalidateQueries({ queryKey: ['adminTheaters'] });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this theater?')) return;
    try {
      await theaterService.delete(id);
      toast.success('Theater removed.');
      queryClient.invalidateQueries({ queryKey: ['adminTheaters'] });
    } catch (err) {
      toast.error('Failed to remove theater.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-cinema-muted">
        <Loader2 className="w-10 h-10 text-cinema-red animate-spin mb-4" />
        <p className="text-sm font-semibold uppercase tracking-wider">Loading theaters...</p>
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence>{modal !== null && <TheaterModal theater={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}</AnimatePresence>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-cinema-off-white flex items-center gap-2"><Building2 className="w-6 h-6 text-cinema-red" /> Theater Management</h1>
          <p className="text-cinema-muted text-sm mt-1">{theaters.length} theaters registered</p>
        </div>
        <button onClick={() => setModal('add')} className="bg-cinema-red hover:bg-cinema-red-dark text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Theater
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {theaters.map(t => (
          <motion.div key={t._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-cinema-dark border border-cinema-border rounded-2xl p-5 hover:border-cinema-red/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-cinema-red/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-cinema-red" />
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.isActive ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-400/10'}`}>
                {t.isActive ? 'active' : 'inactive'}
              </span>
            </div>
            <h3 className="text-cinema-off-white font-bold">{t.name}</h3>
            <p className="text-cinema-muted text-sm">{t.city}</p>
            {t.location && <p className="text-cinema-muted text-xs mt-1">{t.location}</p>}
            <div className="flex items-center gap-3 mt-3 text-xs text-cinema-muted">
              <span className="flex items-center gap-1"><Monitor className="w-3.5 h-3.5" /> {t.screens?.length || 0} screens</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setModal(t)} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-cinema-border text-cinema-muted hover:border-cinema-red hover:text-cinema-off-white rounded-lg transition-all">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button onClick={() => handleDelete(t._id)} className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-cinema-red/40 text-cinema-red hover:bg-cinema-red/10 rounded-lg transition-all">
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
