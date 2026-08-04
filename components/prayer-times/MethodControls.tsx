'use client';

import { Select, type SelectOption } from '@/components/ui/Select';
import { MethodSelect } from '@/components/ui/MethodSelect';
import type { CalculationMethod, Madhab, HighLatitudeRule, NaflMethod } from '../../types/prayer-times';

interface MethodControlsProps {
  calculationMethod: CalculationMethod;
  madhab: Madhab;
  highLatitudeRule: HighLatitudeRule;
  naflMethod: NaflMethod;
  onChange: (updates: {
    calculation_method?: CalculationMethod;
    madhab?: Madhab;
    high_latitude_rule?: HighLatitudeRule;
    nafl_method?: NaflMethod;
  }) => void;
  disabled?: boolean;
}

const MADHAB_OPTIONS: SelectOption<Madhab>[] = [
  { value: 'SHAFI', label: 'Shafi\'i' },
  { value: 'HANAFI', label: 'Hanafi' },
];

const HIGH_LATITUDE_OPTIONS: SelectOption<HighLatitudeRule>[] = [
  { value: 'MIDDLE_OF_THE_NIGHT', label: 'Middle of the Night' },
  { value: 'SEVENTH_OF_THE_NIGHT', label: '1/7th of the Night' },
  { value: 'TWILIGHT_ANGLE', label: 'Twilight Angle' },
];

const NAFL_METHOD_OPTIONS: SelectOption<NaflMethod>[] = [
  { value: 'STANDARD_15MIN', label: 'Standard 15 min' },
  { value: 'QUARTER_DAY', label: 'Quarter Day' },
  { value: 'SOLAR_ANGLE_SPEAR', label: 'Solar Angle (Spear)' },
  { value: 'SOLAR_ANGLE_DUHA', label: 'Solar Angle (Duha)' },
  { value: 'MALIKI_DELAYED', label: 'Maliki Delayed' },
];

export function MethodControls({
  calculationMethod,
  madhab,
  highLatitudeRule,
  naflMethod,
  onChange,
  disabled = false,
}: MethodControlsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MethodSelect
        value={calculationMethod}
        onChange={(v) => onChange({ calculation_method: v })}
        disabled={disabled}
        label="Calculation Method"
      />
      <Select
        label="Madhab"
        options={MADHAB_OPTIONS}
        value={madhab}
        onChange={(v: Madhab) => onChange({ madhab: v })}
        disabled={disabled}
        placeholder="Select madhab"
      />
      <Select
        label="High Latitude Rule"
        options={HIGH_LATITUDE_OPTIONS}
        value={highLatitudeRule}
        onChange={(v: HighLatitudeRule) => onChange({ high_latitude_rule: v })}
        disabled={disabled}
        placeholder="Select rule"
      />
      <Select
        label="Nafl Method"
        options={NAFL_METHOD_OPTIONS}
        value={naflMethod}
        onChange={(v: NaflMethod) => onChange({ nafl_method: v })}
        disabled={disabled}
        placeholder="Select method"
      />
    </div>
  );
}