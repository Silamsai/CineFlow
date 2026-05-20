import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.isAdmin) {
        localStorage.setItem('cineflow_admin', 'true');
        navigate('/admin');
      } else {
        setError('Access denied. Admin privileges required.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cinema-black flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cinema-red/5 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-cinema-dark border border-cinema-border rounded-2xl p-8 shadow-card">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-cinema-red rounded-2xl flex items-center justify-center mb-3">
              <Film className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-cinema-off-white">CineFlow Admin</h1>
            <p className="text-cinema-muted text-sm mt-1">Sign in to the admin panel</p>
          </div>

          {/* Hint box */}
          <div className="bg-cinema-red/10 border border-cinema-red/30 rounded-xl p-3 mb-6 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-cinema-red flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="text-cinema-off-white font-semibold">Demo Credentials</p>
              <p className="text-cinema-muted mt-0.5">Email: <span className="text-cinema-red font-mono">admin@cineflow.com</span></p>
              <p className="text-cinema-muted">Password: <span className="text-cinema-red font-mono">Admin@123</span></p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@cineflow.com"
                className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cinema-red transition-colors" />
            </div>
            <div>
              <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-cinema-red transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-muted hover:text-cinema-off-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-cinema-red text-sm text-center bg-cinema-red/10 border border-cinema-red/30 rounded-lg px-4 py-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-cinema-red hover:bg-cinema-red-dark text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
