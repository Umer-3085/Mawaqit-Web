'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTodayPrayerTimes } from '@/hooks/usePrayerTimes';
import { useLocation, useUpdateLocation } from '@/hooks/useLocationMutations';
import type { LocationParams, PrayerTimesResponse, CalculationMethod, Madhab, HighLatitudeRule, NaflMethod } from '@/types/prayer-times';
import { LocationInput } from './LocationInput';
import { MethodControls } from './MethodControls';
import { PrayerTimeCard } from './PrayerTimeCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { cn } from '@/components/ui/utils';

interface TodayPrayerTimesClientProps {
  initialData: PrayerTimesResponse | null;
  initialParams: LocationParams;
}

const DEBOUNCE_MS = 300;

export function TodayPrayerTimesClient({ initialData, initialParams }: TodayPrayerTimesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [params, setParams] = useState<LocationParams & {
    calculationMethod: CalculationMethod;
    madhab: Madhab;
    highLatitudeRule: HighLatitudeRule;
    naflMethod: NaflMethod;
  }>({
    ...initialParams,
    calculationMethod: initialParams.method,
    madhab: 'SHAFI',
    highLatitudeRule: 'MIDDLE_OF_THE_NIGHT',
    naflMethod: initialParams.nafl_method,
  });

  const [geolocationLoading, setGeolocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { updateLocation } = useUpdateLocation();

  const { data, error: swrError, isLoading, mutate } = useTodayPrayerTimes(
    {
      lat: params.lat,
      lng: params.lng,
      timezone: params.timezone,
      calculation_method: params.calculationMethod,
      madhab: params.madhab,
      high_latitude_rule: params.highLatitudeRule,
      nafl_method: params.naflMethod,
    },
    { fallbackData: initialData ?? undefined }
  );

  const debouncedPush = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (newParams: typeof params) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const sp = new URLSearchParams();
          sp.set('lat', newParams.lat.toString());
          sp.set('lng', newParams.lng.toString());
          sp.set('timezone', newParams.timezone);
          sp.set('method', newParams.calculationMethod);
          sp.set('madhab', newParams.madhab);
          sp.set('highLat', newParams.highLatitudeRule);
          sp.set('naflMethod', newParams.naflMethod);
          router.push(`/prayer-times?${sp.toString()}`, { scroll: false });
        }, DEBOUNCE_MS);
      };
    })(),
    [router]
  );

  const handleChange = useCallback(
    async (updates: Partial<typeof params>) => {
      const newParams = { ...params, ...updates };
      setParams(newParams);
      debouncedPush(newParams);
      setError(null);
      try {
        await updateLocation(newParams);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update location');
      }
    },
    [params, debouncedPush, updateLocation]
  );

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setGeolocationLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        handleChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timezone: tz,
        });
        setGeolocationLoading(false);
      },
      (err) => {
        setError(err.message);
        setGeolocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [handleChange]);

  const displayData = data ?? initialData;

  const obligatoryTimes = displayData
    ? [
        { label: 'Fajr', time: displayData.fajr, isObligatory: true },
        { label: 'Sunrise', time: displayData.sunrise, isObligatory: false },
        { label: 'Dhuhr', time: displayData.dhuhr, isObligatory: true },
        { label: 'Asr', time: displayData.asr, isObligatory: true },
        { label: 'Maghrib', time: displayData.maghrib, isObligatory: true },
        { label: 'Isha', time: displayData.isha, isObligatory: true },
      ]
    : [];

  const naflTimes = displayData
    ? [
        { label: 'Ishraq', time: displayData.ishraq, elevation: displayData.ishraq_elevation },
        { label: 'Duha Start', time: displayData.duha_start, elevation: displayData.duha_start_elevation },
        { label: 'Duha End', time: displayData.duha_end },
        { label: 'Awwabin Start', time: displayData.awwabin_start },
        { label: 'Awwabin End', time: displayData.awwabin_end },
      ]
    : [];

  if (isLoading && !initialData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-text-muted">Loading prayer times…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(swrError || error) && (
        <ErrorAlert
          message={error ?? swrError?.message ?? 'Failed to load prayer times'}
          onDismiss={() => setError(null)}
        />
      )}

      <section aria-labelledby="location-heading" className="space-y-2">
        <h2 id="location-heading" className="text-lg font-semibold text-text">
          Location
        </h2>
        <LocationInput
          lat={params.lat}
          lng={params.lng}
          timezone={params.timezone}
          onChange={handleChange}
          onGeolocation={handleGeolocation}
          geolocationLoading={geolocationLoading}
          error={error}
        />
      </section>

      <section aria-labelledby="methods-heading" className="space-y-2">
        <h2 id="methods-heading" className="text-lg font-semibold text-text">
          Calculation Methods
        </h2>
        <MethodControls
          calculationMethod={params.calculationMethod}
          madhab={params.madhab}
          highLatitudeRule={params.highLatitudeRule}
          naflMethod={params.naflMethod}
          onChange={handleChange}
        />
      </section>

      <section aria-labelledby="obligatory-heading" className="space-y-2">
        <h2 id="obligatory-heading" className="text-lg font-semibold text-text">
          Obligatory Prayers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {obligatoryTimes.map((item, idx) => (
            <PrayerTimeCard
              key={idx}
              label={item.label}
              time={item.time}
              isObligatory={item.isObligatory}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="nafl-heading" className="space-y-2">
        <h2 id="nafl-heading" className="text-lg font-semibold text-text">
          Nafl &amp; Elevation
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {naflTimes.map((item, idx) =>
            item.time || item.elevation ? (
              <PrayerTimeCard
                key={idx}
                label={item.label}
                time={item.time}
                elevation={item.elevation}
              />
            ) : null
          )}
        </div>
      </section>

      <Button variant="ghost" size="sm" onClick={() => mutate()} disabled={isLoading}>
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Refreshing…
          </>
        ) : (
          'Refresh Now'
        )}
      </Button>
    </div>
  );
}