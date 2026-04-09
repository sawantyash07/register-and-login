import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, User, ShieldCheck } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        identifier: formData.identifier,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success(`Welcome back, ${response.data.user.username}!`, {
        icon: '🚀',
        duration: 4000,
        style: {
          borderRadius: '15px',
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      });
      navigate('/quiz');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unauthorized access', {
        duration: 4000,
        style: {
          borderRadius: '15px',
          background: '#450a0a',
          color: '#fca5a5',
          border: '1px solid #7f1d1d'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setStoredUser(JSON.parse(user));
      } catch (e) {
        console.error("Failed to parse stored user");
      }
    }
  }, []);

  const eyeVariants = {
    closed: { scaleY: 0.1, opacity: 0.5 },
    open: { scaleY: 1, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-[#030712] overflow-hidden">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl flex flex-col lg:flex-row glass-card overflow-hidden relative z-10"
      >
        {/* Left Side: Interactive Profile Panel */}
        <div className="hidden lg:flex w-1/2 p-16 flex-col justify-between bg-white/[0.02] border-r border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mb-10 border border-primary/30 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
            >
              <User className="w-10 h-10 text-primary" />
            </motion.div>
            
            <h2 className="text-6xl font-black text-white leading-tight tracking-tighter mb-6">
              SECURE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-secondary animate-gradient-x">
                GATEWAY
              </span>
            </h2>
            <p className="text-white/40 text-lg font-medium max-w-sm leading-relaxed">
              Unlock your digital vault and synchronize with the core network protocols.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
             <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-5 group hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-0.5">Network Status</p>
                   <p className="text-sm font-bold text-white uppercase tracking-widest">Active & Encrypted</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col justify-center relative bg-[#030712]/40 backdrop-blur-md">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-white tracking-tight mb-3">Login</h1>
            <div className="h-1 w-12 bg-primary rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">ID</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="identifier"
                  required
                  placeholder="Enter ID"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 text-white placeholder:text-white/10 input-glow font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Password</label>
                <Link to="/forgot-password" title="Recall Access" className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 text-white placeholder:text-white/10 input-glow font-bold text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-white/20 hover:text-white transition-all"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, x: 5 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-14 cursor-pointer text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="bg-[#0b1121] px-4 text-white/20">Uplink</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.98 }}
              className="social-btn h-12 border border-white/5"
            >
               <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
            </motion.button>
            <motion.button 
              whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.98 }}
              className="social-btn h-12 border border-white/5"
            >
               <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
            </motion.button>
          </div>

          <p className="mt-10 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
            New here?{' '}
            <Link to="/register" className="text-white hover:text-primary transition-colors border-b border-primary/40 pb-1 font-bold ml-1">
              Register Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
