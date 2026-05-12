import React from 'react';

const styles = {
  Strategy: 'bg-blue-500/10 text-blue-300',
  Campaign: 'bg-purple-500/10 text-purple-300',
  Research: 'bg-emerald-500/10 text-emerald-300',
  Creative: 'bg-pink-500/10 text-pink-300',
  Analytics: 'bg-orange-500/10 text-orange-300',
};

const CategoryChip = ({ category }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[category] ?? 'bg-white/5 text-white/40'}`}>
    {category || 'Other'}
  </span>
);

export default CategoryChip;