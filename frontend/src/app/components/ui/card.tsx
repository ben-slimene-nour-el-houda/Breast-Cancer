import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'purple' | 'blue' | 'none';
}

export function Card({ children, className = '', gradient = 'none' }: CardProps) {
  const gradientStyles = {
    purple: 'bg-gradient-to-br from-[#9333EA] to-[#EC4899] text-white',
    blue: 'bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-white',
    none: 'bg-white',
  };
  
  return (
    <div className={`rounded-lg shadow-sm p-6 ${gradientStyles[gradient]} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
