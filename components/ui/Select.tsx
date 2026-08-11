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
  error?: string | null;
  helperText?: string;
  onChange?: (value: T) => void;
}

function SelectComponent<T = string>(
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
        className="block text-xs font-semibold text-ivory uppercase tracking-wide mb-1.5"
      >
        {label}
        {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          onChange={handleChange}
          className={cn(
            'w-full px-3.5 py-2 pr-9 rounded-lg border appearance-none text-sm min-h-[44px]',
            'bg-surface text-text cursor-pointer',
            'transition-all duration-150 ease-out',
            'focus:outline-none focus:ring-4 focus:ring-lime/40 focus:border-lime',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-error focus:ring-error/20 focus:border-error'
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
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-error font-medium">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1.5 text-xs text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}

SelectComponent.displayName = 'Select';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(SelectComponent) as
  <T = string>(props: SelectProps<T> & { ref?: React.Ref<HTMLSelectElement> }) => React.ReactElement | null;