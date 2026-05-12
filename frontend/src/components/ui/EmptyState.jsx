import React from 'react';

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
    <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-bg-raised border border-border text-text-tertiary">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-lg  text-text-primary tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-text-secondary">{subtitle}</p>
    </div>
  </div>
);

export default EmptyState;