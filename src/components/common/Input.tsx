import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  containerClassName = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-white border border-slate-100 rounded-2xl py-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-bold ${
            icon ? 'pl-12 pr-5' : 'px-5'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-rose-500 text-[10px] font-bold ml-1">{error}</p>}
    </div>
  );
};
