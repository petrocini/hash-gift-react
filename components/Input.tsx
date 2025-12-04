import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-slate-400 pl-1">{label}</label>
      <input 
        className={`w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors placeholder:text-slate-600 ${className}`}
        {...props}
      />
    </div>
  );
};