'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from './utils';
import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-light focus-visible:ring-primary/20',
  secondary: 'bg-secondary text-white hover:bg-secondary-hover active:bg-secondary focus-visible:ring-secondary/20',
  outline: 'border border-border bg-transparent text-text hover:bg-surface active:bg-surface-elevated hover:border-primary/50 focus-visible:ring-primary/20',
  ghost: 'text-text hover:bg-surface active:bg-surface-elevated focus-visible:ring-primary/20',
  danger: 'bg-error text-white hover:bg-error/90 active:bg-error focus-visible:ring-error/20',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 min-h-[36px]',
  md: 'px-4 py-2 text-base gap-2 min-h-[44px]',
  lg: 'px-6 py-3 text-lg gap-2.5 min-h-[48px]',
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
          'inline-flex items-center justify-center font-medium rounded-lg',
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