import React from 'react';
import { Upload, Brain, Search } from 'lucide-react';
import {SectionBadge} from '../ui';

const STEPS = [
  {
    num: '01',
    icon: <Upload size={22} />,
    title: 'Upload your documents',
    desc: 'Drag and drop any PDF, Word doc, or text file. We handle up to 10MB per file with instant upload feedback.',
  },
  {
    num: '02',
    icon: <Brain size={22} />,
    title: 'AI processes & tags',
    desc: 'Gemini AI reads your document, generates a summary, assigns categories, and creates semantic embeddings automatically.',
  },
  {
    num: '03',
    icon: <Search size={22} />,
    title: 'Search in plain English',
    desc: 'Type what you\'re looking for "Q3 campaign budget" or "compliance update", and get ranked results instantly.',
  },
];



const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-16">
           <SectionBadge label="How it works" />
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"> Three steps to<br /><span className="ss-shimmer">zero friction.</span></h2>
          <p className="text-text-secondary max-w-md mx-auto">From raw file to instant retrieval in under 15 seconds. No manual tagging. No folder structures. No wasted time.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {STEPS.map((step, i) => (
            <div key={i} className="group flex flex-col gap-4 p-6 rounded-2xl bg-bg-elevated border border-border hover:border-accent/25 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-bg-raised border border-border text-accent group-hover:bg-accent/10 group-hover:border-accent/30 transition-all">
                  {step.icon}
                </div>
                <span className="text-3xl font-extrabold text-text-secondary group-hover:text-accent transition-colors select-none">
                  {step.num}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;