import React, { useState } from 'react';
import { FileSearch, Zap, Shield, Sparkles, Lock, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { guestLogin } from '../../services/api';
import { Button } from '../ui';
import Login from './Login';
import Register from './Register';

const features = [
  {
    icon: <Zap size={20} />,
    title: 'Instant AI Processing',
    desc: 'Auto-categorize, tag, and summarize any document in under 15 seconds',
  },
  {
    icon: <FileSearch size={20} />,
    title: 'Semantic Search',
    desc: 'Ask in plain English - find exactly what you need across every file',
  },
  {
    icon: <Shield size={20} />,
    title: 'Enterprise-Grade Security',
    desc: 'AES-256 encrypted storage with SOC 2-compliant infrastructure',
  },
  {
    icon: <Sparkles size={20} />,
    title: 'Multi-Format Support',
    desc: 'PDF, DOCX, TXT, and Markdown - every file type, one unified search',
  },
];


const AuthPage = () => {

  const [isLogin, setIsLogin] = useState(true);
 
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 relative overflow-hidden">

      <div className="absolute -top-40 -left-20 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">

        <div className="hidden lg:flex flex-col gap-9  animate-[fadeUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-accent shadow-[0_0_20px_var(--color-accent-glow)] animate-[float_3s_ease-in-out_infinite]">
              <FileSearch size={18} color="#0a0a0b" strokeWidth={2.5} />
            </div>
            <span className="text-4xl font-bold text-text-primary tracking-tight">Smart Search</span>
          </div>

          <div>
            <h1 className="text-5xl font-extrabold text-text-primary leading-none tracking-tight mb-4">
              Your docs,
              <span className="bg-linear-to-r from-accent to-amber-300 bg-clip-text text-transparent">intelligently</span>
              <br />organized. </h1>
            <p className="text-base text-text-secondary leading-relaxed max-w-md">
              Stop wasting hours digging through folders. Smart Search uses AI to automatically
              classify, tag, and surface your documents - so your team finds the right file
              in seconds, every time.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-bg-raised border border-border text-accent">
                  {f.icon}
                </div>
                <div>
                  <p className="text-base font-medium text-text-primary">{f.title}</p>
                  <p className="text-sm text-text-secondary">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="animate-[fadeUp_0.4s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]">
          <div className="flex lg:hidden items-center  gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent">
              <FileSearch size={15} color="#0a0a0b" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Smart Search
            </span>
          </div>

          {isLogin
            ? <Login onToggleForm={() => setIsLogin(false)} />
            : <Register onToggleForm={() => setIsLogin(true)} />
          }
        </div>

      </div>
    </div>
  );
};

export default AuthPage;