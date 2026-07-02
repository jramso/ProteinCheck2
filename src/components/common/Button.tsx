import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-2xl';
  
  const variants = {
    primary: 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800',
    outline: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
    xl: 'px-8 py-5 text-lg font-black tracking-tight',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {loading && (
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {!loading && icon && (
          <span className="inline-flex items-center justify-center shrink-0">{icon}</span>
        )}
        <span>{children}</span>
      </span>
    </button>
  );
};
