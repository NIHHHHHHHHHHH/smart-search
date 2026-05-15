import React from 'react';
import { Star } from 'lucide-react';
import { SectionBadge } from '../ui';

const TESTIMONIALS = [
  {
    text: 'I stopped wasting time hunting through folders. I just type what I need and it shows up with a relevance score. The AI tagging is accurate right from the first upload.',
    name: 'Sarah K.',
    role: 'Marketing Director',
  },
  {
    text: 'The semantic search is the best part, it finds what I mean, not just what I typed. Searched "budget approval" and got the right finance doc even though those exact words weren\'t in the filename.',
    name: 'James R.',
    role: 'Content Strategist',
  },
  {
    text: 'Upload a PDF, get a summary and tags in seconds. I use it as a personal knowledge base now. Everything is searchable and the relevance scores tell me exactly what to open first.',
    name: 'Priya M.',
    role: 'Operations Lead',
  },
];

const Testimonials = () => {
  return (
    <section id='testimonials' className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
           <SectionBadge label="What People Will Say" />
          <h2 className="text-4xl font-extrabold tracking-tight"> Built for people who<br /><span className="ss-shimmer">value their time.</span></h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="flex flex-col gap-5 p-6 rounded-2xl bg-bg-elevated border border-border">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} className="text-accent fill-accent" />
                ))}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed flex-1"> "{t.text}"</p>
              <div>
                <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                <p className="text-xs text-text-secondary">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;