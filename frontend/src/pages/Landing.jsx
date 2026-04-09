import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { ArrowRight, Shield } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#020617] text-white">
      <AnimatedBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm uppercase tracking-[0.35em] text-primary shadow-sm shadow-primary/20">
                QUIZ ACCESS
              </div>
              <h1 className="text-5xl font-black leading-tight md:text-6xl">
                Ready to take the quiz?
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Login first to continue.</span>
              </h1>
              <p className="max-w-2xl text-lg text-white/70">
                This page is your landing area. Click the button below to go to login, and only after a successful login will the protected quiz page become available.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-primary/90"
                >
                  <span>Login to Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-primary"
                >
                  <Shield className="h-4 w-4" />
                  Create Account
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/20 p-8 shadow-2xl shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.28em] text-white/40">Secure flow</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-white/60">1. Landing page with login CTA.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-white/60">2. Login page checks credentials.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-white/60">3. Quiz page opens only after successful login.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
