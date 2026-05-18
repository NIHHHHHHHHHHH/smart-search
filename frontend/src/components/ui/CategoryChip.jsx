import React from 'react';

const styles = {
  Strategy: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  Campaign: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  Research: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  Creative: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  Analytics: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
};

const CategoryChip = ({ category }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border ${styles[category]}`}>
    {category || 'Other'}
  </span>
);

export default CategoryChip;