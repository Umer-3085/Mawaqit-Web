'use client';

import { cn } from './utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'white' | 'current';
  'aria-label'?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 stroke-[3]',
  md: 'h-5 w-5 stroke-[3]',
  lg: 'h-8 w-8 stroke-[3]',
};

const colorClasses = {
  primary: 'text-primary',
  white: 'text-white',
  current: 'text-current',
};

export function LoadingSpinner({
  size = 'md',
  className,
  color = 'current',
  'aria-label': ariaLabel = 'Loading',
}: LoadingSpinnerProps) {
  return (
    <div role="status" aria-label={ariaLabel} className={cn('inline-flex items-center justify-center', className)}>
      <svg
        className={cn('animate-spin', sizeClasses[size], colorClasses[color])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}