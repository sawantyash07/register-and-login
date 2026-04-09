import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="glass-card p-10 relative overflow-hidden group">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="text-center mb-10">
            <motion.div
              whileHover={{ rotate: 90 }}
              className="inline-block p-4 rounded-3xl bg-white/5 mb-6 border border-white/10"
            >
              <Lock className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Login</h1>
            <p className="text-white/30 text-sm font-medium">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">ID</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="identifier"
                  required
                  placeholder="Enter ID"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/10 input-glow font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Password</label>
                <Link to="/forgot-password" title="Recall Access" className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-14 text-white placeholder:text-white/10 input-glow font-bold text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white transition-all"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-14 cursor-pointer text-sm font-black uppercase tracking-[0.2em]"
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

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="bg-[#0f172a] px-4 text-white/20">Uplink</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="social-btn h-12"
            >
               <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="social-btn h-12"
            >
               <span className="text-[10px] font-black uppercase tracking-widest">GitHub</span>
            </motion.button>
          </div>

          <p className="mt-8 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
            New here?{' '}
            <Link to="/register" className="text-white hover:text-primary transition-colors border-b border-white/10 pb-1">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
