import React from 'react';
import { Eye, EyeOff } from 'lucide-react';


const TextInput = ({
  icon: Icon,
  iconClassName,
  type = 'text',
  hasError,
  showToggle,
  showValue,
  onToggle,
  extraBorderClass = '',
  ...props
}) => {
  const inputType = showToggle ? (showValue ? 'text' : 'password') : type;

  return (
    <div className="relative">
      {Icon && (
        <Icon size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none${iconClassName ?? (hasError ? 'text-error' : 'text-text-tertiary')}`}/>
      )}
      <input
        type={inputType}
        className={`w-full py-2.5 text-sm rounded-xl bg-bg-raised border text-text-primary
          placeholder:text-text-tertiary outline-none transition-all duration-150 disabled:opacity-50
          ${Icon ? 'pl-9' : 'pl-4'}
          ${showToggle ? 'pr-10' : 'pr-4'}
          ${hasError
            ? 'border-error/40 focus:border-error/60 focus:ring-2 focus:ring-error/10'
            : 'border-border hover:border-border-hover focus:border-accent/50 focus:ring-2 focus:ring-accent/10'
          }
          ${extraBorderClass}`}
        {...props}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
        >
          {showValue ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
};

export default TextInput;