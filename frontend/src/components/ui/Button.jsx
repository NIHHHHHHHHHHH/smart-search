import React from 'react';
import Spinner from './Spinner';


const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary: 'bg-[var(--color-accent)] text-black hover:bg-amber-400 shadow-[0_0_20px_var(--color-accent-glow)] hover:shadow-[0_0_28px_var(--color-accent-glow)]',
  secondary: 'bg-[var(--color-bg-raised)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]',
  ghost: 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-raised)]',
  danger: 'text-red-400 hover:bg-red-500/10',
  demo: 'text-purple-300 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/18 hover:border-purple-500/35',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
};

const spinnerVariant = {
  primary: 'dark',
  secondary: 'light',
  ghost: 'light',
  danger: 'light',
  demo: 'light',
};

const Button = ({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  fullWidth = false,
  type = 'button',
  disabled,
  onClick,
  className = '',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      ${base}
      ${variants[variant]}
      ${sizes[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim()}
  >
    {loading
      ? <><Spinner variant={spinnerVariant[variant]} size={13} />{children}</>
      : children
    }
  </button>
);

export default Button;