import React from 'react';
import { Hash } from 'lucide-react';

const Tag = ({ children }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs text-text-secondary bg-bg-raised border border-border">
    <Hash size={9} className="opacity-40" />
    {children}
  </span>
);

export default Tag;