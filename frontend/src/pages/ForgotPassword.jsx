import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import CenteredAlert from '../components/CenteredAlert';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (!formData.mobile || !/^[0-9]{10,15}$/.test(formData.mobile)) {
      toast.error('Mobile requires 10-15 digits');
      return false;
    }
    if (!formData.newPassword || formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await API.post('/api/auth/reset-password', formData);
      setAlert({
        show: true,
        message: 'IDENTITY KEY UPDATED. ACCESS RESTORED.',
        type: 'success'
      });
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || 'VERIFICATION FAILED. CORE DATA MISMATCH.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <AnimatedBackground />

      <CenteredAlert 
        isOpen={alert.show} 
        onClose={() => setAlert({ ...alert, show: false })} 
        message={alert.message} 
        type={alert.type} 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px]"
      >
        <div className="glass-card p-10 relative">
          <Link to="/login" className="absolute top-8 left-8 text-white/20 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <div className="text-center mb-10">
            <div className="inline-block p-4 rounded-3xl bg-red-500/10 mb-6 border border-red-500/20">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Identity Recovery</h1>
            <p className="text-white/40 text-sm mt-2">Verify your details to reset your access key</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-white/50 tracking-widest ml-1">Registered Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@matrix.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 text-white input-glow text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-white/50 tracking-widest ml-1">Registered Mobile</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  required
                  placeholder="+1..."
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 text-white input-glow text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <label className="text-[10px] uppercase font-black text-white/50 tracking-widest ml-1">New Access Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary transition-colors">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  required
                  placeholder="Minimum 8 characters"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-10 pr-12 text-white input-glow text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 text-white/20 hover:text-white"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-12 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Key Reset"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
