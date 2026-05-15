import React from 'react';

const SectionBadge = ({ label }) => (
  <div className="inline-flex items-center gap-1.5 mb-4">
    <span className="text-accent font-light text-base ">/</span>
    <span className="text-sm font-bold tracking-[0.14em] uppercase text-text-secondary">
      {label}
    </span>
    <span className="text-accent font-light text-base ">/</span>
  </div>
);

export default SectionBadge;