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
    
    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Minimum 3 characters required";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Alphanumeric characters only";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Mobile validation
    if (!formData.mobile) {
      newErrors.mobile = "Mobile is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = "Requires 10-15 digits";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 characters required";
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

      toast.success('Registration successful!', {
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
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-[#030712] overflow-hidden">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[520px] relative z-10"
      >
        <div className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary"></div>

          <Link to="/login" className="absolute top-8 left-8 text-white/20 hover:text-white transition-all group/back">
            <ArrowLeft className="w-6 h-6 group-hover/back:-translate-x-1 transition-transform" />
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Create Account</h1>
            <p className="text-white/30 text-sm font-medium">Join our community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Username</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="JohnDoe"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full h-12 bg-white/5 border ${errors.username ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-10 pr-4 text-white placeholder:text-white/10 input-glow text-sm font-bold`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Contact</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    placeholder="1234567890"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`w-full h-12 bg-white/5 border ${errors.mobile ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-10 pr-4 text-white placeholder:text-white/10 input-glow text-sm font-bold`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Email</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full h-12 bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-10 pr-4 text-white placeholder:text-white/10 input-glow text-sm font-bold`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full h-12 bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-10 pr-12 text-white placeholder:text-white/10 input-glow text-sm font-bold`}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-14 mt-4 text-sm font-black uppercase tracking-[0.2em]"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Register"}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
            Already registered?{' '}
            <Link to="/login" className="text-primary hover:text-white transition-colors border-b border-primary/20 pb-0.5">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
