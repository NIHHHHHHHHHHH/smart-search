import React from 'react';

const borders = {
  dark: 'border-black/20 border-t-black',
  light: 'border-white/20 border-t-white',
  accent: 'border-white/10 border-t-[var(--color-accent)]',
};

const Spinner = ({ size = 14, variant = 'dark' }) => (
  <div
    className={`rounded-full border-2 animate-[spin_0.8s_linear_infinite] shrink-0 ${borders[variant]}`}
    style={{ width: size, height: size }}
  />
);

export default Spinner;