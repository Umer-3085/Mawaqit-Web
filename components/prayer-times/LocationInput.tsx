'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface LocationInputProps {
  lat: number;
  lng: number;
  timezone: string;
  onChange: (updates: { lat?: number; lng?: number; timezone?: string }) => void;
  onGeolocation: () => void;
  geolocationLoading?: boolean;
  error?: string | null;
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
  const [prevLat, setPrevLat] = useState(lat);
  const [prevLng, setPrevLng] = useState(lng);
  const [latInput, setLatInput] = useState(lat.toString());
  const [lngInput, setLngInput] = useState(lng.toString());

  if (lat !== prevLat) {
    setPrevLat(lat);
    setLatInput(lat.toString());
  }

  if (lng !== prevLng) {
    setPrevLng(lng);
    setLngInput(lng.toString());
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-start">
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

      <div className="flex items-center justify-between gap-4 pt-1">
        <Button
          variant="primary"
          size="sm"
          onClick={onGeolocation}
          disabled={disabled || geolocationLoading}
          className="w-full sm:w-auto font-semibold shadow-sm"
        >
          {geolocationLoading ? (
            <>
              <LoadingSpinner size="sm" color="current" className="mr-2" />
              Detecting Location…
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use My Location
            </>
          )}
        </Button>
        <span className="text-xs text-text-muted hidden sm:inline-block">
          Decimal degrees (-90..90, -180..180)
        </span>
      </div>
    </div>
  );
}
