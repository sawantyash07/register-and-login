import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LayoutGrid, Terminal, Cpu, Globe, Zap, Settings, User } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../context/AuthContext';

const Quiz = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (authUser) {
      // Typewriter Effect Logic
      let i = 0;
      const fullText = authUser.username || 'Agent';
      setDisplayText(''); // Reset display text
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setDisplayText(prev => prev + fullText.charAt(i));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 150);
      
      return () => clearInterval(typingInterval);
    }
  }, [authUser]);

  const handleLogout = () => {
    logout();
    toast.success('Session Terminated', {
      icon: '🔐',
      style: {
        borderRadius: '15px',
        background: '#1e293b',
        color: '#fff',
      }
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-6 relative flex flex-col items-center">
      <AnimatedBackground />

      {/* Header Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="w-full max-w-6xl flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] mb-12 shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="text-white w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">NEURAL CORE</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">System Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-2xl text-red-500 transition-all font-bold text-sm tracking-wide"
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT BASE</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl flex flex-col items-center justify-center -mt-20">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="text-center space-y-8"
        >
          <div className="relative inline-block">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
             />
             <div className="relative w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md m-4">
                <User className="w-16 h-16 text-white/20" />
             </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter">
              SYSTEM <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-purple-400">
                AUTHORIZED
              </span>
            </h1>
            <p className="text-white/40 text-lg md:text-2xl font-medium max-w-2xl mx-auto tracking-tight leading-relaxed">
              Your neural uplink is synchronized. Access Level: <span className="text-white/80 uppercase">{authUser?.role || 'Command Authority'}</span>
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {[
              { icon: Zap, label: "Power", val: "98%" },
              { icon: Globe, label: "Network", val: "Active" },
              { icon: Terminal, label: "Shell", val: "Root" },
              { icon: Settings, label: "Config", val: "Perf+" }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors group cursor-pointer">
                <stat.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                <div className="text-center">
                   <p className="text-[10px] uppercase font-black text-white/30 tracking-widest">{stat.label}</p>
                   <p className="text-lg font-bold text-white">{stat.val}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <footer className="w-full max-w-6xl py-10 flex justify-between items-center text-[10px] font-bold text-white/20 tracking-widest border-t border-white/5">
        <p>© 2026 SYNORA NEURAL SYSTEMS</p>
        <p>ENCRYPTION: AES-256-GCM</p>
      </footer>
    </div>
  );
};

export default Quiz;
