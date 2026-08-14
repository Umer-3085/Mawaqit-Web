'use client';

import { forwardRef, type TextareaHTMLAttributes, useId } from 'react';
import { cn } from './utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | null;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      id: providedId,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const describedBy = [error && errorId, helperText && helperId, ariaDescribedBy]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold text-label uppercase tracking-wide mb-1.5"
          >
            {label}
            {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={cn(
            'w-full px-3.5 py-2 rounded-lg border text-sm min-h-[88px]',
            'bg-surface text-text placeholder:text-text-muted/60',
            'transition-all duration-150 ease-out',
            'focus:outline-none focus:ring-4 focus:ring-lime/40 focus:border-lime',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-error focus:ring-error/20 focus:border-error'
              : 'border-border hover:border-border-focus',
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs text-error font-medium"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={helperId}
            className="mt-1.5 text-xs text-text-muted"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
