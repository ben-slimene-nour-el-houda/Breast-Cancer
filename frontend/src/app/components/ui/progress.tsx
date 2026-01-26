import React from 'react';

interface ProgressProps {
  value: number;
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'yellow';
  className?: string;
  showLabel?: boolean;
}

export function Progress({ value, color = 'purple', className = '', showLabel = false }: ProgressProps) {
  const colorStyles = {
    purple: 'bg-[#9333EA]',
    blue: 'bg-[#2563EB]',
    green: 'bg-[#10B981]',
    orange: 'bg-[#F97316]',
    red: 'bg-[#DC2626]',
    yellow: 'bg-[#FBBF24]',
  };
  
  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorStyles[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 mt-1">{value}%</span>
      )}
    </div>
  );
}
