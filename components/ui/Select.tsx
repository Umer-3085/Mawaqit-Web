'use client';

import { forwardRef, type SelectHTMLAttributes, useId } from 'react';
import { cn } from './utils';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T = string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: SelectOption<T>[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  onChange?: (value: T) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select<T = string>(
    {
      label,
      options,
      placeholder,
      error,
      helperText,
      className,
      id: providedId,
      disabled,
      required,
      onChange,
      'aria-describedby': ariaDescribedBy,
      ...props
    }: SelectProps<T>,
    ref: React.Ref<HTMLSelectElement>
  ) {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const describedBy = [error && errorId, helperText && helperId, ariaDescribedBy]
      .filter(Boolean)
      .join(' ') || undefined;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value as T);
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
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          onChange={handleChange}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border appearance-none',
            'bg-surface text-text',
            'dark:bg-surface dark:text-text',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-error focus:ring-error'
              : 'border-border hover:border-border-focus',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={String(option.value)} value={String(option.value)} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
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
Select.displayName = 'Select';