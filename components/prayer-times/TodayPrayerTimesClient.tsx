'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTodayPrayerTimes, usePrayerTimes } from '../../hooks/usePrayerTimes';
import { useUpdateLocation } from '../../hooks/useLocationMutations';
import type { LocationParams, PrayerTimesResponse, CalculationMethod, Madhab, HighLatitudeRule, NaflMethod } from '../../types/prayer-times';
import { LocationPicker } from './LocationPicker';
import { MethodControls } from './MethodControls';
import { PrayerTimeCard } from './PrayerTimeCard';
import { MethodInfo } from './MethodInfo';
import { NaflMethodBadge } from './NaflMethodBadge';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { Button } from '@/components/ui/Button';
import { formatDateWithHijri, getTodayISO } from '../../lib/date-utils';
import { reverseGeocode } from '../../lib/geocoding';

interface TodayPrayerTimesClientProps {
  initialData: PrayerTimesResponse | null;
  initialParams: LocationParams;
  isDatePage?: boolean;
  dateParam?: string;
}

interface ClientParams {
  lat: number;
  lng: number;
  timezone: string;
  calculation_method: CalculationMethod;
  madhab: Madhab;
  high_latitude_rule: HighLatitudeRule;
  nafl_method: NaflMethod;
  cityName?: string;
}

const DEBOUNCE_MS = 300;

function toClientParams(params: LocationParams): ClientParams {
  return {
    lat: params.lat,
    lng: params.lng,
    timezone: params.timezone,
    calculation_method: params.calculation_method,
    madhab: params.madhab,
    high_latitude_rule: params.high_latitude_rule,
    nafl_method: params.nafl_method,
  };
}

function toLocationParams(params: ClientParams): LocationParams {
  return {
    lat: params.lat,
    lng: params.lng,
    timezone: params.timezone,
    calculation_method: params.calculation_method,
    madhab: params.madhab,
    high_latitude_rule: params.high_latitude_rule,
    nafl_method: params.nafl_method,
  };
}

export function TodayPrayerTimesClient({
  initialData,
  initialParams,
  isDatePage = false,
  dateParam,
}: TodayPrayerTimesClientProps) {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleDateConfirm = () => {
    if (selectedDate) {
      const params = new URLSearchParams(window.location.search);
      router.push('/prayer-times/' + selectedDate + '?' + params.toString());
    }
    setShowDatePicker(false);
  };

  const [params, setParams] = useState<ClientParams>(toClientParams(initialParams));
  const [geolocationLoading, setGeolocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [controlsOpen, setControlsOpen] = useState(true);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

const { updateLocation } = useUpdateLocation();

  // Use different hooks based on whether it's a date page or today page
  const todayHook = useTodayPrayerTimes(
    {
      lat: params.lat,
      lng: params.lng,
      timezone: params.timezone,
      calculation_method: params.calculation_method,
      madhab: params.madhab,
      high_latitude_rule: params.high_latitude_rule,
      nafl_method: params.nafl_method,
    },
    { fallbackData: initialData ?? undefined }
  );

  const dateHook = usePrayerTimes(
    isDatePage && dateParam
      ? {
          lat: params.lat,
          lng: params.lng,
          timezone: params.timezone,
          calculation_method: params.calculation_method,
          madhab: params.madhab,
          high_latitude_rule: params.high_latitude_rule,
          nafl_method: params.nafl_method,
          prayer_date: dateParam,
        }
      : null,
    { fallbackData: initialData ?? undefined }
  );

  const { data, error: swrError, isLoading, mutate } = isDatePage ? dateHook : todayHook;

  const buildUrl = useCallback(
    (newParams: ClientParams) => {
      const sp = new URLSearchParams();
      sp.set('lat', newParams.lat.toString());
      sp.set('lng', newParams.lng.toString());
      sp.set('timezone', newParams.timezone);
      sp.set('calculation_method', newParams.calculation_method);
      sp.set('madhab', newParams.madhab);
      sp.set('high_latitude_rule', newParams.high_latitude_rule);
      sp.set('nafl_method', newParams.nafl_method);
      const basePath = isDatePage && dateParam ? '/prayer-times/' + dateParam : '/prayer-times';
      return basePath + '?' + sp.toString();
    },
    [isDatePage, dateParam]
  );

  const debouncedPush = useCallback(
    (newParams: ClientParams) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        router.push(buildUrl(newParams), { scroll: false });
      }, DEBOUNCE_MS);
    },
    [router, buildUrl]
  );

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = useCallback(
    async (updates: Partial<ClientParams>) => {
      const newParams = { ...params, ...updates };
      setParams(newParams);
      debouncedPush(newParams);
      setError(null);
      try {
        await updateLocation(toLocationParams(newParams));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update location');
      }
    },
    [params, debouncedPush, updateLocation]
  );

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }
    setGeolocationLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const cityData = await reverseGeocode(position.coords.latitude, position.coords.longitude);
        handleChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timezone: tz,
          cityName: cityData?.city,
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

  // Determine next prayer (only for today page)
  const getNextPrayerIndex = () => {
    if (!displayData || isDatePage) return -1;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const times = [
      displayData.fajr,
      displayData.sunrise,
      displayData.dhuhr,
      displayData.asr,
      displayData.maghrib,
      displayData.isha,
    ];

    for (let i = 0; i < times.length; i++) {
      const t = times[i];
      if (!t) continue;
      const parts = t.split(':');
      const h = parseInt(parts[0] || '0', 10);
      const m = parseInt(parts[1] || '0', 10);
      if (h * 60 + m > currentMins) return i;
    }
    return 0;
  };

  const nextPrayerIdx = getNextPrayerIndex();

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

  // Date formatting
  let dateFormatted: ReturnType<typeof formatDateWithHijri>;
  if (isDatePage && dateParam) {
    dateFormatted = formatDateWithHijri(dateParam);
  } else if (displayData?.date) {
    dateFormatted = formatDateWithHijri(displayData.date);
  } else {
    dateFormatted = formatDateWithHijri(getTodayISO());
  }

  const pageTitle = isDatePage ? 'Prayer Times for' : "Today's Prayer Times";
  const arabicTitle = isDatePage ? 'أوقات الصلاة لـ' : 'أوقات الصلاة';

  return (
    <div className='space-y-8'>
      {/* Page Title & Date Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-text flex items-center gap-3'>
            {pageTitle}
            <span className='font-arabic text-primary text-xl font-normal' dir='rtl'>
              {' '}{arabicTitle}
            </span>
          </h1>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1'>
            <p className='text-sm text-text-muted'>{dateFormatted.gregorian}</p>
            <span className='text-sm text-text-muted font-arabic' dir='rtl'>
              {dateFormatted.hijriShort}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setControlsOpen(!controlsOpen)}
            className='flex items-center gap-2 text-xs font-semibold'
          >
            <svg className='w-4 h-4 text-text-muted' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
            </svg>
            {controlsOpen ? 'Hide Controls' : 'Location & Methods'}
</Button>

<Button
            variant='ghost'
            size='sm'
            onClick={() => mutate()}
            disabled={isLoading}
            className='text-xs'
          >
            {isLoading ? <LoadingSpinner size='sm' /> : 'Refresh'}
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowDatePicker(true)}
            className='flex items-center gap-2 text-xs font-semibold'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z' />
            </svg>
            View Another Date
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              const sp = new URLSearchParams();
              sp.set('lat', params.lat.toString());
              sp.set('lng', params.lng.toString());
              sp.set('timezone', params.timezone);
              sp.set('calculation_method', params.calculation_method);
              sp.set('madhab', params.madhab);
              sp.set('high_latitude_rule', params.high_latitude_rule);
              sp.set('nafl_method', params.nafl_method);
              router.push('/prayer-times/range?' + sp.toString());
            }}
            className='flex items-center gap-2 text-xs font-semibold'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
            </svg>
            View Range
          </Button>

          {showDatePicker && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
              <div className='bg-surface rounded-xl p-6 w-full max-w-md shadow-xl border border-border'>
                <h3 className='text-lg font-semibold text-text mb-4'>Select Date</h3>
                <input
                  type='date'
                  value={selectedDate}
                  onChange={handleDateChange}
                  className='w-full px-4 py-3 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary'
                  max={getTodayISO()}
                />
                <div className='flex justify-end gap-2 mt-4'>
                  <Button variant='ghost' size='sm' onClick={() => setShowDatePicker(false)}>
                    Cancel
                  </Button>
                  <Button variant='primary' size='sm' onClick={handleDateConfirm}>
                    Go to Date
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {(swrError || error) && (
        <ErrorAlert
          message={error ?? swrError?.message ?? 'Failed to load prayer times'}
          onDismiss={() => setError(null)}
          onRetry={() => mutate()}
        />
      )}

      {/* Single Controls Card (Location + Methods collapsible) */}
      <div className={controlsOpen ? 'block' : 'hidden md:block'}>
        <Card className='p-6 space-y-6'>
          <div className='border-b border-border/40 pb-5'>
            <h2 className='text-xs font-bold uppercase tracking-wider text-primary mb-3'>
              Location Settings
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
          </div>

          <div>
            <h2 className='text-xs font-bold uppercase tracking-wider text-primary mb-3'>
              Calculation Methods & Preferences
            </h2>
            <MethodControls
              calculationMethod={params.calculation_method}
              madhab={params.madhab}
              highLatitudeRule={params.high_latitude_rule}
              naflMethod={params.nafl_method}
              onChange={handleChange}
            />
          </div>

          {/* MethodInfo - Collapsible variant */}
          <MethodInfo
            calculation_method={params.calculation_method}
            madhab={params.madhab}
            high_latitude_rule={params.high_latitude_rule}
            nafl_method={params.nafl_method}
            variant="collapsible"
          />
        </Card>
      </div>

      {/* Obligatory Prayers Section */}
      <section aria-labelledby='obligatory-heading' className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 id='obligatory-heading' className='text-lg font-bold text-text flex items-center gap-2'>
            <span>Obligatory Prayers</span>
            <span className='text-xs font-normal text-text-muted'>(الصلوات المفروضة)</span>
          </h2>
        </div>

        {isLoading && !displayData ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='h-32 rounded-xl bg-surface-elevated/60 animate-pulse border border-border/30' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
            {obligatoryTimes.map((item, idx) => (
              <PrayerTimeCard
                key={idx}
                label={item.label}
                time={item.time}
                isObligatory={item.isObligatory}
                isNext={idx === nextPrayerIdx}
              />
            ))}
          </div>
        )}
      </section>

      {/* Nafl & Elevation Section */}
      <section aria-labelledby='nafl-heading' className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 id='nafl-heading' className='text-lg font-bold text-text flex items-center gap-2'>
            <span>Nafl Prayers & Solar Angle</span>
            <span className='text-xs font-normal text-text-muted'>(النوافل والشروق)</span>
          </h2>
          <div className="flex items-center gap-2">
            <NaflMethodBadge method={params.nafl_method} variant="inline" />
          </div>
        </div>

        {isLoading && !displayData ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='h-28 rounded-xl bg-surface-elevated/60 animate-pulse border border-border/30' />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
            {naflTimes.map((item, idx) =>
              item.time || item.elevation ? (
                <PrayerTimeCard
                  key={idx}
                  label={item.label}
                  time={item.time}
                  elevation={item.elevation}
                  elevationTooltip={true}
                  naflMethod={params.nafl_method}
                  showNaflBadge={true}
                />
              ) : null
            )}
          </div>
        )}
      </section>
    </div>
  );
}
