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
        'relative flex items-start gap-3 p-4 rounded-lg',
        'bg-error/10 border border-error/20 text-error',
        'dark:bg-error/20 dark:border-error/30',
        className
      )}
      {...props}
    >
      <svg
        className="flex-shrink-0 h-5 w-5 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-medium">{title}</p>
        )}
        <p className={cn('text-sm', title && 'mt-1')}>{message}</p>
        {onRetry && (
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={onRetry}>
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
            'flex-shrink-0 p-1 rounded',
            'hover:bg-error/20 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-error'
          )}
          aria-label="Dismiss"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>
      )}
    </div>
  );
}