'use client';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from './utils';

export type CardProps = ComponentPropsWithoutRef<'div'>;
export type CardHeaderProps = ComponentPropsWithoutRef<'div'>;
export type CardContentProps = ComponentPropsWithoutRef<'div'>;
export type CardFooterProps = ComponentPropsWithoutRef<'div'>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl bg-surface shadow-sm hover:shadow-md transition-shadow duration-150 ease-out border border-border/50',
        'dark:bg-surface dark:border-border/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-border/50', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-t border-border/50 bg-surface-elevated/50 rounded-b-xl', className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = 'CardFooter';