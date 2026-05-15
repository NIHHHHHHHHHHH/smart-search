import React from 'react';
import SectionBadge from '../ui/SectionBadge';
import { BarChart2, Brain, FileText, Search, Shield, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: <Brain size={20} />,
    title: 'AI Categorization',
    desc: 'Gemini AI reads every uploaded document and automatically assigns a category, project tag, and plain-English summary, no manual input needed.',
    tag: 'Google Gemini',
  },
  {
    icon: <Search size={20} />,
    title: 'Hybrid Search',
    desc: 'Combines keyword matching (60%) with semantic similarity (40%) so you can search naturally and still surface exact terms when precision matters.',
    tag: '85–90% accuracy',
  },
  {
    icon: <Zap size={20} />,
    title: 'Fast Processing',
    desc: 'Upload a file and get AI-generated tags, a summary, and relevance scores in 5–15 seconds. Search results come back in under 100ms.',
    tag: 'Sub-15s upload',
  },
  {
    icon: <FileText size={20} />,
    title: 'Multi-Format Support',
    desc: 'PDF, DOCX, DOC, TXT, and Markdown are all supported. Text is extracted intelligently from each format before AI processing.',
    tag: '5 file types',
  },
  {
    icon: <BarChart2 size={20} />,
    title: 'Relevance Scoring',
    desc: 'Every search result comes with a 0-100% relevance score, so you can immediately see which documents are the closest match to your query.',
    tag: 'Scored results',
  },
  {
    icon: <Shield size={20} />,
    title: 'Secure Storage',
    desc: 'Files are stored on Cloudinary\'s CDN with encrypted transit and at-rest protection. A 10MB file size limit and type whitelist keep things safe.',
    tag: 'Cloudinary CDN',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-28 px-6 bg-bg-elevated/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <SectionBadge label="Features" />
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Everything you need.<br /><span className="ss-shimmer">Nothing you don't.</span></h2>
          <p className="text-text-secondary max-w-md mx-auto">Upload once. AI handles the rest, categorization, tagging, summaries, and search, all without any manual work from you.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="group flex flex-col gap-4 p-6 rounded-2xl bg-bg-elevated border border-border hover:border-accent/30 transition-all duration-200 hover:shadow-[0_0_30px_var(--color-accent-subtle)]">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-bg-raised border border-border text-accent group-hover:bg-accent-dim group-hover:border-accent/25 transition-all">
                  {f.icon}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest border rounded-full px-2 py-0.5 transition-all duration-200 text-text-secondary border-border group-hover:text-accent group-hover:border-accent/40">
                  {f.tag}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold mb-1.5">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;