import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Globe, Cpu, ChevronDown } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-[#030712] text-white overflow-hidden">
      <AnimatedBackground />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
             </div>
             <span className="text-xl font-black tracking-tighter uppercase">Neural-Base</span>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <Link to="/quiz" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-black hover:bg-primary hover:text-white transition-all">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
           >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Secure Uplink Established
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tightest leading-[0.9] mb-8">
                SYNC WITH THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-secondary">FUTURE.</span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-white/40 text-lg md:text-xl font-medium leading-relaxed mb-12">
                Experience the next generation of secure authentication and neural synchronization. 
                Fast, encrypted, and built for the modern workspace.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link to={user ? "/quiz" : "/register"} className="w-full sm:w-auto px-10 py-5 bg-primary text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:scale-105 transition-transform flex items-center justify-center gap-3">
                  {user ? "Dashboard" : "Get Started"} <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-colors">
                  View Specs
                </button>
              </div>
           </motion.div>
        </div>

        {/* Floating Decors */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] -z-10"></div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-3 gap-8">
           {[
             { icon: Shield, title: "Neural Defense", desc: "Advanced encryption protocols protecting every byte of your data." },
             { icon: Zap, title: "Instant Sync", desc: "Real-time synchronization across all your secure terminal nodes." },
             { icon: Globe, title: "Edge Network", desc: "Low-latency access from anywhere in the digital world." }
           ].map((feature, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.2 }}
               className="glass-card p-10 hover:border-primary/50 transition-colors group cursor-default"
             >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                   <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed font-medium">{feature.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-5xl mx-auto px-6 py-32 text-center">
         <div className="glass-card p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10">READY TO INITIALIZE?</h2>
            <p className="text-white/40 max-w-xl mx-auto mb-10 relative z-10">Join the thousands of users already synchronized with the neural core.</p>
            <Link to="/register" className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all relative z-10">
               Initialize Account <ArrowRight className="w-5 h-5" />
            </Link>
         </div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
         <div className="flex items-center gap-3 opacity-40">
            <Cpu className="w-5 h-5 text-white" />
            <span className="text-sm font-black uppercase tracking-tighter">Neural-Base</span>
         </div>
         <div className="flex gap-10 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
         </div>
         <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em]">© 2026 SYNORA SYSTEMS</p>
      </footer>
    </div>
  );
};

export default Home;
