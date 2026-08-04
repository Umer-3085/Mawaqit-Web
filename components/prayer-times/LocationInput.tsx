'use client';

import { useState, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select, type SelectOption } from '../../components/ui/Select';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { cn } from '../../components/ui/utils';

interface LocationInputProps {
  lat: number;
  lng: number;
  timezone: string;
  onChange: (updates: { lat?: number; lng?: number; timezone?: string }) => void;
  onGeolocation: () => void;
  geolocationLoading?: boolean;
  error?: string;
  disabled?: boolean;
}

const TIMEZONES = Intl.supportedValuesOf('timeZone');

export function LocationInput({
  lat,
  lng,
  timezone,
  onChange,
  onGeolocation,
  geolocationLoading = false,
  error,
  disabled = false,
}: LocationInputProps) {
  const [latInput, setLatInput] = useState(lat.toString());
  const [lngInput, setLngInput] = useState(lng.toString());

  const timezoneOptions: SelectOption[] = TIMEZONES.map((tz) => ({
    value: tz,
    label: tz.replace(/_/g, ' '),
  }));

  const handleLatChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLatInput(value);
      if (value && !isNaN(parseFloat(value))) {
        onChange({ lat: parseFloat(value) });
      }
    },
    [onChange]
  );

  const handleLngChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLngInput(value);
      if (value && !isNaN(parseFloat(value))) {
        onChange({ lng: parseFloat(value) });
      }
    },
    [onChange]
  );

  const handleTimezoneChange = useCallback(
    (value: string) => {
      onChange({ timezone: value });
    },
    [onChange]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Latitude"
          type="number"
          step="0.0001"
          min={-90}
          max={90}
          value={latInput}
          onChange={handleLatChange}
          placeholder="33.6844"
          disabled={disabled}
          error={error}
          helperText="Decimal degrees (-90 to 90)"
        />
        <Input
          label="Longitude"
          type="number"
          step="0.0001"
          min={-180}
          max={180}
          value={lngInput}
          onChange={handleLngChange}
          placeholder="73.0479"
          disabled={disabled}
          error={error}
          helperText="Decimal degrees (-180 to 180)"
        />
        <Select
          label="Timezone"
          options={timezoneOptions}
          value={timezone}
          onChange={handleTimezoneChange}
          disabled={disabled}
          error={error}
          placeholder="Select timezone"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onGeolocation}
        disabled={disabled || geolocationLoading}
        className="w-full sm:w-auto"
      >
        {geolocationLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Locating…
          </>
        ) : (
          'Use My Location'
        )}
      </Button>

      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}