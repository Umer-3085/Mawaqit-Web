'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from './utils';
import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-lime text-black hover:bg-lime-hover active:bg-lime-light focus-visible:ring-lime/40',
  secondary: 'border border-border/40 bg-transparent text-text hover:bg-surface active:bg-surface-elevated hover:border-lime/50 focus-visible:ring-lime/40',
  outline: 'border border-border bg-transparent text-text hover:bg-surface-elevated active:bg-surface hover:border-lime/60 focus-visible:ring-lime/40',
  ghost: 'text-text hover:bg-surface active:bg-surface-elevated focus-visible:ring-lime/40',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 min-h-[36px] rounded-md',
  md: 'px-4 py-2 text-base gap-2 min-h-[44px] rounded-lg',
  lg: 'px-6 py-3 text-lg gap-2.5 min-h-[48px] rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-4',
          'disabled:opacity-50 disabled:cursor-not-allowed select-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && <LoadingSpinner size={size === 'sm' ? 'sm' : 'md'} color="current" className="mr-1.5" />}
        <span className={cn('inline-flex items-center gap-1.5', loading && 'opacity-70')}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';