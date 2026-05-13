import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 p-3 mb-5 rounded-xl bg-error-bg border border-error/20">
      <AlertCircle size={14} className="text-error shrink-0 mt-0.5" />
      <p className="text-sm text-error">{message}</p>
    </div>
  );
};

export default ErrorBanner;