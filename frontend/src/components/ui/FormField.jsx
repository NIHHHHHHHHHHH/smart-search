import React from 'react';

const FormField = ({ label, error, children, rightLabel }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="block text-xs font-medium text-text-secondary">{label}</label>
      {rightLabel}
    </div>
    {children}
    {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
  </div>
);

export default FormField;