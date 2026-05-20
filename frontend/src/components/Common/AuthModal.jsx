import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Logo from './Logo';

const ADMIN_EMAIL = 'admin@cineflow.com';
const ADMIN_PASSWORD = 'Admin@123';

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const { login, signup, googleLogin } = useAuthContext();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Check admin credentials first
      if (loginData.email === ADMIN_EMAIL && loginData.password === ADMIN_PASSWORD) {
        localStorage.setItem('cineflow_admin', 'true');
        toast.success('Welcome back, Administrator.');
        onClose();
        navigate('/admin');
        setLoading(false);
        return;
      }
      // Regular user login
      login(loginData.email, loginData.password);
      toast.success('Welcome back!');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirm) { toast.error('Passwords do not match'); return; }
    if (signupData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      signup({ firstName: signupData.firstName, lastName: signupData.lastName, email: signupData.email, password: signupData.password });
      toast.success(`Welcome, ${signupData.firstName}!`);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const user = googleLogin(decoded);
      toast.success(`Welcome, ${user.firstName}!`);
      onClose();
    } catch (err) {
      toast.error('Google login failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed');
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center px-4"
          onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }}
            className="bg-cinema-dark border border-cinema-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <Logo height={28} />
              <button onClick={onClose} className="p-1.5 text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex mx-6 mb-6 bg-cinema-black rounded-xl p-1">
              <button onClick={() => setTab('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'login' ? 'bg-cinema-red text-white' : 'text-cinema-muted hover:text-cinema-off-white'}`}>
                Sign In
              </button>
              <button onClick={() => setTab('signup')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'signup' ? 'bg-cinema-red text-white' : 'text-cinema-muted hover:text-cinema-off-white'}`}>
                Sign Up
              </button>
            </div>

            <div className="px-6 pb-6">
              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Email</label>
                    <input type="email" required value={loginData.email} onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cinema-red transition-colors" />
                  </div>
                  <div>
                    <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} required value={loginData.password} onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-cinema-red transition-colors" />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-muted hover:text-cinema-off-white">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-cinema-red hover:bg-cinema-red-dark text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                  <p className="text-center text-cinema-muted text-sm">
                    No account?{' '}
                    <button type="button" onClick={() => setTab('signup')} className="text-cinema-red hover:underline font-semibold">Sign up free</button>
                  </p>
                  
                  <div className="relative flex items-center my-4">
                    <div className="flex-grow border-t border-cinema-border"></div>
                    <span className="flex-shrink-0 mx-4 text-cinema-muted text-xs">OR</span>
                    <div className="flex-grow border-t border-cinema-border"></div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2.5">
                    <GoogleLogin 
                      onSuccess={handleGoogleSuccess} 
                      onError={handleGoogleError}
                      theme="filled_black"
                      shape="pill"
                    />
                    <button type="button" onClick={() => toast.error('Apple Sign-In is only supported on iOS/macOS devices for development.')}
                      className="w-[200px] flex items-center justify-center gap-2 bg-black hover:bg-zinc-950 text-white border border-cinema-border hover:border-cinema-red py-1.5 px-3 rounded-full transition-all text-xs font-semibold shadow-sm">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-1 2.94 1.08.08 2.17-.52 2.83-1.33z"/>
                      </svg>
                      Continue with Apple
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">First Name</label>
                      <input type="text" required value={signupData.firstName} onChange={e => setSignupData(d => ({ ...d, firstName: e.target.value }))}
                        placeholder="John"
                        className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-cinema-red transition-colors" />
                    </div>
                    <div>
                      <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Last Name</label>
                      <input type="text" required value={signupData.lastName} onChange={e => setSignupData(d => ({ ...d, lastName: e.target.value }))}
                        placeholder="Doe"
                        className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-cinema-red transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Email</label>
                    <input type="email" required value={signupData.email} onChange={e => setSignupData(d => ({ ...d, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cinema-red transition-colors" />
                  </div>
                  <div>
                    <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} required value={signupData.password} onChange={e => setSignupData(d => ({ ...d, password: e.target.value }))}
                        placeholder="Min. 6 characters"
                        className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-cinema-red transition-colors" />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-muted hover:text-cinema-off-white">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-cinema-muted text-xs font-semibold uppercase tracking-wider block mb-1.5">Confirm Password</label>
                    <input type="password" required value={signupData.confirm} onChange={e => setSignupData(d => ({ ...d, confirm: e.target.value }))}
                      placeholder="Repeat password"
                      className="w-full bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cinema-red transition-colors" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-cinema-red hover:bg-cinema-red-dark text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                  <p className="text-center text-cinema-muted text-sm">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setTab('login')} className="text-cinema-red hover:underline font-semibold">Sign in</button>
                  </p>
                  
                  <div className="relative flex items-center my-4">
                    <div className="flex-grow border-t border-cinema-border"></div>
                    <span className="flex-shrink-0 mx-4 text-cinema-muted text-xs">OR</span>
                    <div className="flex-grow border-t border-cinema-border"></div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2.5">
                    <GoogleLogin 
                      onSuccess={handleGoogleSuccess} 
                      onError={handleGoogleError}
                      theme="filled_black"
                      shape="pill"
                    />
                    <button type="button" onClick={() => toast.error('Apple Sign-In is only supported on iOS/macOS devices for development.')}
                      className="w-[200px] flex items-center justify-center gap-2 bg-black hover:bg-zinc-950 text-white border border-cinema-border hover:border-cinema-red py-1.5 px-3 rounded-full transition-all text-xs font-semibold shadow-sm">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-1 2.94 1.08.08 2.17-.52 2.83-1.33z"/>
                      </svg>
                      Continue with Apple
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
