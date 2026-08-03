'use client';

import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import { cn } from './utils';

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  min?: string;
  max?: string;
  placeholder?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      helperText,
      min,
      max,
      placeholder = 'YYYY-MM-DD',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className={cn(
            'block text-sm font-medium text-text',
            'dark:text-text',
            'mb-1.5'
          )}
        >
          {label}
          {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
        </label>
        <input
          ref={ref}
          id={id}
          type="date"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border',
            'bg-surface text-text placeholder:text-text-muted',
            'dark:bg-surface dark:text-text dark:placeholder:text-text-muted',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-error focus:ring-error'
              : 'border-border hover:border-border-focus',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-sm text-error">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
DatePicker.displayName = 'DatePicker';