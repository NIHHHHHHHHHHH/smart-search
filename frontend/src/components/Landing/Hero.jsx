import React, { useState, useEffect } from 'react';
import { FileSearch, Sparkles, ArrowRight, ChevronRight, Users, FileText, Search, Check } from 'lucide-react';
import {Button} from '../ui'

const SearchDemo = () => {
  const queries = [
    'Q3 marketing strategy deck',
    'compliance policy 2024',
    'product roadmap highlights',
    'onboarding checklist',
  ];

  const results = [
    [
      { name: 'Q3 Marketing Strategy.pdf', tag: 'Strategy', score: 97 },
      { name: 'Q3 Campaign Brief.docx', tag: 'Campaign', score: 84 },
      { name: 'Q3 Budget Overview.pdf', tag: 'Finance', score: 76 },
    ],
    [
      { name: 'Compliance Policy 2024.pdf', tag: 'Legal', score: 99 },
      { name: 'HR Handbook Update.docx', tag: 'HR', score: 81 },
    ],
    [
      { name: 'Product Roadmap H2.pdf', tag: 'Product', score: 95 },
      { name: 'Feature Specs Q4.docx', tag: 'Engineering', score: 88 },
      { name: 'Design System v2.pdf', tag: 'Design', score: 72 },
    ],
    [
      { name: 'Onboarding Checklist.docx', tag: 'HR', score: 98 },
      { name: 'New Hire Guide.pdf', tag: 'HR', score: 85 },
    ],
  ];

  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    let t;
    const q = queries[qi];
    if (phase === 'typing') {
      if (typed.length < q.length) {
        t = setTimeout(() => setTyped(q.slice(0, typed.length + 1)), 55);
      } else {
        t = setTimeout(() => { setShowResults(true); setPhase('showing'); }, 400);
      }
    } else if (phase === 'showing') {
      t = setTimeout(() => setPhase('clearing'), 2600);
    } else if (phase === 'clearing') {
      if (typed.length > 0) {
        t = setTimeout(() => setTyped(typed.slice(0, -1)), 22);
      } else {
        setShowResults(false);
        setQi((qi + 1) % queries.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(t);
  }, [typed, phase, qi]);

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-bg-elevated border border-border shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <Search size={15} className="text-accent shrink-0" />
        <span className="text-sm text-text-primary flex-1 min-h-5">{typed}<span className="animate-pulse text-accent">|</span></span>
        <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-bg-raised border border-border text-text-tertiary"> ⏎</kbd>
      </div>

      {showResults && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl bg-bg-elevated border border-border overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-10">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-text-tertiary">Results</span>
            <span className="text-[10px] text-text-tertiary">{results[qi].length} found</span>
          </div>
          {results[qi].map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 hover:bg-bg-raised transition-colors" style={{ animation: `ssfadeUp 0.2s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both` }}>
              <div className="w-7 h-7 rounded-lg bg-bg-raised border border-border flex items-center justify-center shrink-0">
                <FileText size={12} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">{r.name}</p>
                <span className="text-[10px] text-text-tertiary">{r.tag}</span>
              </div>
              <div className="shrink-0 text-[10px] font-semibold text-accent">
                {r.score}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const Hero = ({ onGetStarted, onGuestLogin, guestLoading }) => {

  const uploadedFiles = [
    { name: 'Q3_Strategy.pdf', color: 'text-chip-red', bg: 'bg-chip-red-bg border-chip-red-border' },
    { name: 'Compliance.docx', color: 'text-chip-blue', bg: 'bg-chip-blue-bg border-chip-blue-border' },
    { name: 'Roadmap.pdf', color: 'text-chip-green', bg: 'bg-chip-green-bg border-chip-green-border' },
  ];

  return (
    <section className="relative overflow-hidden pt-24 pb-32 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-accent/4 blur-[120px] pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-purple-500/4 blur-[80px] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)',
          backgroundSize: '100px 100px', }}/>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="ss-fadeup inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 rounded-full border border-accent/25 bg-accent/8 text-sm font-semibold text-accent tracking-wide">
          <Sparkles size={11} />
          AI-Powered Document Intelligence
          <ChevronRight size={11} />
        </div>

        <h1 className="ss-fadeup-d1 text-4xl sm:text-6xl md:text-7xl font-extrabold leading-none tracking-tight mb-6">
          Find any document<br />
          <span className="ss-shimmer">in seconds.</span>
        </h1>
        <p className="ss-fadeup-d2 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto mb-10">
          Upload your team's documents once. Let AI handle categorization, tagging, and summaries automatically.
          Then search everything in plain English  and find it instantly.
        </p>
        <div className="ss-fadeup-d3 flex items-center justify-center gap-3 flex-wrap mb-16">
            <Button className="cursor-pointer" variant="primary" size="md" onClick={onGetStarted}>Start for Free <ArrowRight size={15}></ArrowRight></Button>
           <Button className="text-text-secondary cursor-pointer" variant="secondary" size="md" onClick={onGuestLogin} disabled={guestLoading}> <Users size={15} /> Try Live Demo</Button>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 rounded-3xl bg-accent/5 blur-2xl scale-110 pointer-events-none" />
            <div className="relative rounded-3xl bg-bg-elevated border border-border p-6 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-1.5 mb-5">
                {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                ))}
                <span className="ml-2 text-xs text-text-tertiary font-mono">smart-search</span>
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium shrink-0 ${f.bg} ${f.color}`}>
                    <FileText size={11} />{f.name}
                    <Check size={10} className="ml-1 opacity-60" />
                  </div>
                ))}
              </div>
              <SearchDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;