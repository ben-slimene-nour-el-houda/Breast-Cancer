import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'high' | 'medium' | 'low' | 'pending' | 'reviewed' | 'positive' | 'negative';
  className?: string;
}

export function Badge({ children, variant, className = '' }: BadgeProps) {
  const variantStyles = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    reviewed: 'bg-green-100 text-green-700 border-green-200',
    positive: 'bg-red-100 text-red-700 border-red-200',
    negative: 'bg-green-100 text-green-700 border-green-200',
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
