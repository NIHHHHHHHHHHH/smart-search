import React from 'react';
import { Hash } from 'lucide-react';

const Tag = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-accent bg-bg-raised border border-accent-glow uppercase">
  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
  {children}
</span>
);

export default Tag;