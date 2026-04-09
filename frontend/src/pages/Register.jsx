import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const calcStrength = (pass) => {
      let score = 0;
      if (!pass) return 0;
      if (pass.length > 6) score += 1;
      if (pass.length > 10) score += 1;
      if (/[A-Z]/.test(pass)) score += 1;
      if (/[0-9]/.test(pass)) score += 1;
      if (/[^A-Za-z0-9]/.test(pass)) score += 1;
      return Math.min(5, score);
    };
    setPasswordStrength(calcStrength(formData.password));
  }, [formData.password]);

  const validate = () => {
    const newErrors = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);

    try {
      await axios.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });

      toast.success('Sequence initialized! You can now log in.', {
        icon: '✅',
        style: {
          borderRadius: '15px',
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      });
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Initialization failed', {
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

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative py-12">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[520px]"
      >
        <div className="glass-card p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary to-primary"></div>

          <Link to="/login" className="absolute top-8 left-8 text-white/20 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Join the Network
            </h1>
            <p className="text-white/40 text-sm font-medium">Create your unique digital signature</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="UserID"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 text-white placeholder:text-white/20 input-glow text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Mobile</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    placeholder="+1..."
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 text-white placeholder:text-white/20 input-glow text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="vanguard@matrix.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full h-12 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-2xl pl-10 pr-4 text-white placeholder:text-white/20 input-glow text-sm`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Secret key"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-10 pr-12 text-white placeholder:text-white/20 input-glow text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              
              {formData.password && (
                <div className="flex gap-1 h-1 px-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div key={level} className={`h-full flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? strengthColors[passwordStrength-1] : 'bg-white/10'}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Confirm Identity</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="Repeat secret key"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full h-12 bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-2xl pl-10 pr-12 text-white placeholder:text-white/20 input-glow text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white"
                >
                  {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-12 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initialize Profile"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-[#0f172a] px-4 text-white/20">Fast Track</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              className="social-btn group h-12 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span>Google</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              className="social-btn group h-12 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.841 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span>GitHub</span>
            </motion.button>
          </div>

          <p className="mt-8 text-center text-white/30 text-xs font-medium">
            Already have a sequence?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-bold transition-colors">
              Access Core
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
