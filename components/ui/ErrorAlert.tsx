'use client';

import { type HTMLAttributes } from 'react';
import { cn } from './utils';
import { Button } from './Button';

export interface ErrorAlertProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  title?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  dismissible?: boolean;
  retryLabel?: string;
}

export function ErrorAlert({
  message,
  title,
  onDismiss,
  onRetry,
  dismissible = true,
  retryLabel = 'Retry',
  className,
  ...props
}: ErrorAlertProps) {
  if (!message && !title) return null;

  return (
    <div
      role="alert"
      className={cn(
        'relative flex items-start gap-3.5 p-4 rounded-xl',
        'bg-error/10 border border-error/15 text-error',
        'dark:bg-error/15 dark:border-error/25',
        'transition-all duration-150 ease-out',
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 p-1 rounded-lg bg-error/15 text-error">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        {title && (
          <p className="text-sm font-semibold text-error mb-0.5">{title}</p>
        )}
        <p className="text-sm text-error/90 leading-relaxed">{message}</p>
        {onRetry && (
          <div className="mt-3">
            <Button variant="secondary" size="sm" onClick={onRetry}>
              {retryLabel}
            </Button>
          </div>
        )}
      </div>
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 p-1.5 rounded-lg',
            'hover:bg-error/20 text-error/80 hover:text-error transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-error/30'
          )}
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}