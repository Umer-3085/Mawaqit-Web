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
  primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-light focus:ring-primary',
  secondary: 'bg-secondary text-white hover:bg-secondary-hover active:bg-secondary focus:ring-secondary',
  outline: 'border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20 focus:ring-primary',
  ghost: 'text-primary hover:bg-primary/10 active:bg-primary/20 focus:ring-primary',
  danger: 'bg-error text-white hover:bg-error/90 active:bg-error focus:ring-error',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
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
          'transition-colors duration-150 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && <LoadingSpinner size={size === 'sm' ? 'sm' : 'md'} color="white" />}
        <span className={cn(loading && 'opacity-0')}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';