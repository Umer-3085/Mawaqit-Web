'use client';

import { Select, type SelectOption } from './Select';
import type { CalculationMethod, CALCULATION_METHODS } from '../../types/prayer-times';

const methodLabels: Record<CalculationMethod, string> = {
  MUSLIM_WORLD_LEAGUE: 'Muslim World League',
  EGYPTIAN: 'Egyptian General Authority of Survey',
  KARACHI: 'University of Islamic Sciences, Karachi',
  UMM_AL_QURA: 'Umm al-Qura University, Makkah',
  DUBAI: 'Dubai',
  MOON_SIGHTING_COMMITTEE: 'Moonsighting Committee Worldwide',
  NORTH_AMERICA: 'Islamic Society of North America (ISNA)',
  KUWAIT: 'Kuwait',
  QATAR: 'Qatar',
  SINGAPORE: 'Singapore',
  UOIF: 'Union des Organisations Islamiques de France',
};

interface MethodSelectProps {
  value: CalculationMethod;
  onChange: (value: CalculationMethod) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function MethodSelect({
  value,
  onChange,
  label = 'Calculation Method',
  error,
  disabled = false,
  required = false,
}: MethodSelectProps) {
  // Import CALCULATION_METHODS dynamically to avoid circular deps if needed
  const methods: CalculationMethod[] = [
    'MUSLIM_WORLD_LEAGUE',
    'EGYPTIAN',
    'KARACHI',
    'UMM_AL_QURA',
    'DUBAI',
    'MOON_SIGHTING_COMMITTEE',
    'NORTH_AMERICA',
    'KUWAIT',
    'QATAR',
    'SINGAPORE',
    'UOIF',
  ];

  const options: SelectOption[] = methods.map((method) => ({
    value: method,
    label: methodLabels[method] || method,
  }));

  return (
    <Select
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      error={error}
      disabled={disabled}
      required={required}
      placeholder="Select calculation method"
    />
  );
}