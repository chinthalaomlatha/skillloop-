import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate' | 'blue' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'md',
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    blue: 'bg-sky-50 text-sky-700 border border-sky-200/60',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/60',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}>
      {children}
    </span>
  );
};
