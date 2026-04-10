import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle, ArrowLeft, UserCircle, Globe, Zap } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../context/AuthContext';
import CenteredAlert from '../components/CenteredAlert';

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });

  useEffect(() => {
    if (user) navigate('/quiz');
  }, [user, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const calcStrength = (pass) => {
      let score = 0;
      if (!pass) return 0;
      if (pass.length > 6) score += 1;
      if (pass.length > 10) score += 1;
      if (/[A-Z]/.test(pass)) score += 1;
      if (/[0-9]/.test(pass)) score += 1;
      if (/[^A-Za-z0-9]/.test(pass)) score += 1;
      return score;
    };
    setPasswordStrength(calcStrength(formData.password));
  }, [formData.password]);

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.mobile) newErrors.mobile = "Mobile is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Minimum 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords match failure";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);

    try {
      await API.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      });

      toast.success('Access Granted. Redirecting...', {
        style: { borderRadius: '15px', background: '#1e293b', color: '#fff' }
      });
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      if (error.response?.status === 409) {
        setAlert({
          show: true,
          message: 'USER IDENTITY ALREADY REGISTERED IN CORE FILES',
          type: 'error'
        });
      } else {
        toast.error(error.response?.data?.message || 'Initialization failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-[#030712] overflow-hidden">
      <AnimatedBackground />
      
      <CenteredAlert 
        isOpen={alert.show} 
        onClose={() => setAlert({ ...alert, show: false })} 
        message={alert.message} 
        type={alert.type} 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl flex flex-col lg:flex-row-reverse glass-card overflow-hidden relative z-10"
      >
        {/* Left Side (Actually Right on desktop because of reverse): Interactive Profile Panel */}
        <div className="hidden lg:flex w-[40%] p-16 flex-col justify-between bg-white/[0.02] border-l border-white/5 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center mb-10 border border-primary/20 shadow-[0_0_40px_rgba(139,92,246,0.1)] group-hover:scale-110 transition-transform duration-500"
            >
              <UserCircle className="w-12 h-12 text-primary" />
            </motion.div>
            
            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter mb-6">
              CREATE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-secondary animate-gradient-x">
                PROFILE
              </span>
            </h2>
            <p className="text-white/40 text-lg font-medium leading-relaxed">
              Start your journey into the neural workspace. Secure, private, and powerful.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-bold text-white/60 tracking-wide uppercase tracking-[0.1em]">Global Access</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Zap className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-sm font-bold text-white/60 tracking-wide uppercase tracking-[0.1em]">Instant Sync</span>
            </div>
          </div>
        </div>

        {/* Right Side (Actually Left on desktop): Register Form */}
        <div className="w-full lg:flex-1 p-10 md:p-16 lg:p-20 flex flex-col justify-center relative bg-[#030712]/40 backdrop-blur-md">
          <Link to="/login" className="absolute top-10 left-10 text-white/20 hover:text-white transition-all group/back flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Go Back</span>
          </Link>

          <div className="mb-12 mt-4">
            <h1 className="text-4xl font-black text-white tracking-tight mb-3">Create Account</h1>
            <div className="h-1 w-12 bg-primary rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Username</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="JohnDoe"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full h-14 bg-white/5 border ${errors.username ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 pr-4 text-white placeholder:text-white/10 input-glow text-sm font-bold`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Contact</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    placeholder="1234567890"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`w-full h-14 bg-white/5 border ${errors.mobile ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 pr-4 text-white placeholder:text-white/10 input-glow text-sm font-bold`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Email</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full h-14 bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 pr-4 text-white placeholder:text-white/10 input-glow text-sm font-bold`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Password</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full h-14 bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-10 pr-10 text-white placeholder:text-white/10 input-glow text-sm font-bold`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Confirm</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-colors">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full h-14 bg-white/5 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-10 pr-10 text-white placeholder:text-white/10 input-glow text-sm font-bold`}
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            <AnimatePresence>
              {formData.password && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 px-1"
                >
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/20">Entropy Analysis</span>
                    <motion.span 
                      key={passwordStrength}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ 
                        color: 
                          passwordStrength === 1 ? '#ef4444' : 
                          passwordStrength === 2 ? '#f97316' : 
                          passwordStrength === 3 ? '#eab308' : 
                          passwordStrength === 4 ? '#3b82f6' : 
                          '#22c55e'
                      }}
                    >
                      {passwordStrength <= 1 ? 'Critical' : 
                       passwordStrength === 2 ? 'Weak' : 
                       passwordStrength === 3 ? 'Fair' : 
                       passwordStrength === 4 ? 'Good' : 'Strong'}
                    </motion.span>
                  </div>
                  <div className="flex gap-2 h-1.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex-1 h-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ 
                            width: i < passwordStrength ? '100%' : '0%',
                            backgroundColor: 
                              passwordStrength === 1 ? '#ef4444' : 
                              passwordStrength === 2 ? '#f97316' : 
                              passwordStrength === 3 ? '#eab308' : 
                              passwordStrength === 4 ? '#3b82f6' : 
                              '#22c55e'
                          }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                          className="h-full"
                          style={{
                            boxShadow: i < passwordStrength ? `0 0 10px ${
                              passwordStrength === 1 ? '#ef4444' : 
                              passwordStrength === 2 ? '#f97316' : 
                              passwordStrength === 3 ? '#eab308' : 
                              passwordStrength === 4 ? '#3b82f6' : 
                              '#22c55e'
                            }44` : 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01, x: 5 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-14 mt-4 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Register Account"}
            </motion.button>
          </form>

          <p className="mt-12 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
            Already registered?{' '}
            <Link to="/login" className="text-primary hover:text-white transition-colors border-b border-primary/20 pb-0.5 ml-1 font-bold">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
