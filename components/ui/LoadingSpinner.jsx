'use client';

import { cn } from '@/lib/utils';

export default function LoadingSpinner({ className, size = 'default' }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className={cn(
        'animate-spin rounded-full border-b-2 border-blue-600',
        sizeClasses[size],
        className
      )} />
    </div>
  );
}