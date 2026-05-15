import React from 'react';
import { FileSearch } from 'lucide-react';
import Button from '../ui/Button';

const CallToAction = ({ onGetStarted, onSignIn }) => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-accent-dim blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent shadow-[0_0_40px_var(--color-accent-glow)] mb-6 mx-auto" style={{ animation: 'ssfloat 3s ease-in-out infinite' }}>
          <FileSearch size={24} color="#0a0a0b" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"> Stop digging through folders.<br /><span className="ss-shimmer">Start finding instantly.</span></h2>
        <p className="text-text-secondary mb-8 leading-relaxed">
          Upload your first document and watch Gemini AI categorize and summarize it in seconds.
          Free to use, no credit card required.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button className="cursor-pointer" variant="primary" size="md" onClick={onGetStarted}>Get started For Free</Button>
          <Button className="text-text-secondary cursor-pointer" variant="secondary" size="md" onClick={onSignIn}>Sign in</Button>
        </div>
        <p className="mt-4 text-sm text-text-tertiary">No signup needed • Try the guest demo instantly</p>
      </div>
    </section>
  );
};

export default CallToAction;