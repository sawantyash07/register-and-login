import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CheckCircle, ShieldAlert } from 'lucide-react';

const CenteredAlert = ({ isOpen, onClose, message, type = 'error' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-sm glass-card p-8 relative overflow-hidden text-center"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 left-0 w-full h-1 ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] ${type === 'error' ? 'bg-red-500/20' : 'bg-green-500/20'}`}></div>

            <div className="relative z-10">
              <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                {type === 'error' ? <ShieldAlert className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                {type === 'error' ? 'System Alert' : 'Success'}
              </h3>
              <p className="text-white/60 font-medium leading-relaxed mb-8">
                {message}
              </p>

              <button
                onClick={onClose}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                  type === 'error' 
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                  : 'bg-green-500 text-white hover:bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                }`}
              >
                Acknowledge
              </button>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CenteredAlert;
