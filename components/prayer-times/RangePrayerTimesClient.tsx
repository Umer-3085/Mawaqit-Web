'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePrayerTimesRange } from '@/hooks/usePrayerTimes';
import { useUpdateLocation } from '@/hooks/useLocationMutations';
import type { LocationParams, PrayerTimesResponse, CalculationMethod, Madhab, HighLatitudeRule, NaflMethod, DateRangeParams } from '@/types/prayer-times';
import { LocationInput } from './LocationInput';
import { MethodControls } from './MethodControls';
import { PrayerTimeCard } from './PrayerTimeCard';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDateWithHijri, getTodayISO, addDaysISO, subDaysISO } from '@/lib/date-utils';
import { cn } from '@/components/ui/utils';

interface RangePrayerTimesClientProps {
  initialData: PrayerTimesResponse[] | null;
  initialParams: LocationParams;
  startDate: string;
  endDate: string;
  initialError: string | null;
  isValidRange: boolean;
}

interface ClientParams {
  lat: number;
  lng: number;
  timezone: string;
  calculation_method: CalculationMethod;
  madhab: Madhab;
  high_latitude_rule: HighLatitudeRule;
  nafl_method: NaflMethod;
}

const DEBOUNCE_MS = 300;
const DEFAULT_DAYS = 7;

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

function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function RangePrayerTimesClient({
  initialData,
  initialParams,
  startDate: initialStartDate,
  endDate: initialEndDate,
  initialError,
  isValidRange,
}: RangePrayerTimesClientProps) {
  const router = useRouter();
  const [params, setParams] = useState<ClientParams>(toClientParams(initialParams));
  const [startDate, setStartDate] = useState<string>(initialStartDate);
  const [endDate, setEndDate] = useState<string>(initialEndDate);
  const [geolocationLoading, setGeolocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { updateLocation } = useUpdateLocation();

  const { data, error: swrError, isLoading, mutate } = usePrayerTimesRange(
    isValidRange
      ? {
          lat: params.lat,
          lng: params.lng,
          timezone: params.timezone,
          calculation_method: params.calculation_method,
          madhab: params.madhab,
          high_latitude_rule: params.high_latitude_rule,
          nafl_method: params.nafl_method,
          start_date: startDate,
          end_date: endDate,
        }
      : null,
    { fallbackData: initialData ?? undefined }
  );

  const buildUrl = useCallback(
    (newParams: ClientParams, newStart: string, newEnd: string) => {
      const sp = new URLSearchParams();
      sp.set('lat', newParams.lat.toString());
      sp.set('lng', newParams.lng.toString());
      sp.set('timezone', newParams.timezone);
      sp.set('calculation_method', newParams.calculation_method);
      sp.set('madhab', newParams.madhab);
      sp.set('high_latitude_rule', newParams.high_latitude_rule);
      sp.set('nafl_method', newParams.nafl_method);
      sp.set('start_date', newStart);
      sp.set('end_date', newEnd);
      return '/prayer-times/range?' + sp.toString();
    },
    []
  );

  const debouncedPush = useCallback(
    (newParams: ClientParams, newStart: string, newEnd: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        router.push(buildUrl(newParams, newStart, newEnd), { scroll: false });
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
      debouncedPush(newParams, startDate, endDate);
      setError(null);
      try {
        await updateLocation(toLocationParams(newParams));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update location');
      }
    },
    [params, startDate, endDate, debouncedPush, updateLocation]
  );

  const handleDateChange = useCallback(
    (field: 'start' | 'end', value: string) => {
      if (field === 'start') {
        setStartDate(value);
      } else {
        setEndDate(value);
      }
    },
    []
  );

  const handleDateConfirm = useCallback(() => {
    const validation = validateDateRangeLocal(startDate, endDate);
    if (!validation.valid) {
      setError(validation.error || 'Invalid date range');
      return;
    }
    setError(null);
    debouncedPush(params, startDate, endDate);
  }, [params, startDate, endDate, debouncedPush]);

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
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

  const handleQuickRange = useCallback(
    (days: number) => {
      const today = getTodayISO();
      const newEnd = subDaysISO(today, 1);
      const newStart = subDaysISO(newEnd, days - 1);
      setStartDate(newStart);
      setEndDate(newEnd);
    },
    []
  );

  const displayData = data ?? initialData;

  const obligatoryColumns: (keyof PrayerTimesResponse)[] = [
    'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'
  ];

  const naflColumns: (keyof PrayerTimesResponse)[] = [
    'ishraq', 'duha_start', 'duha_end', 'awwabin_start', 'awwabin_end'
  ];

  const renderTimeCell = (time: string | undefined, isNext = false) => (
    <td className={cn('px-3 py-2 text-center text-sm font-mono', isNext && 'text-primary font-semibold')}>
      {time ? time.slice(0, 5) : '—'}
    </td>
  );

  return (
    <div className='space-y-6'>
      <section aria-labelledby='range-heading' className='space-y-4'>
        <header className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
          <div>
            <h1 id='range-heading' className='text-2xl font-bold text-text'>
              Prayer Times Range
            </h1>
            <p className='text-text-muted text-sm'>
              {formatDateWithHijri(startDate)} – {formatDateWithHijri(endDate)}
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <div className='flex items-center gap-1 border border-border rounded-lg overflow-hidden'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleQuickRange(7)}
                className={cn('rounded-l-lg', startDate === subDaysISO(subDaysISO(getTodayISO(), 1), 6) && 'bg-primary/10 text-primary')}
              >
                7 Days
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleQuickRange(14)}
                className={cn(startDate === subDaysISO(subDaysISO(getTodayISO(), 1), 13) && 'bg-primary/10 text-primary')}
              >
                14 Days
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleQuickRange(30)}
                className={cn('rounded-r-lg', startDate === subDaysISO(subDaysISO(getTodayISO(), 1), 29) && 'bg-primary/10 text-primary')}
              >
                30 Days
              </Button>
            </div>
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
          </div>
        </header>

        {controlsOpen && (
          <Card className='space-y-4 p-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='lg:col-span-2 space-y-4'>
                <LocationInput
                  params={params}
                  onChange={handleChange}
                  geolocationLoading={geolocationLoading}
                  onGeolocation={handleGeolocation}
                />
              </div>
              <div className='lg:col-span-2 space-y-4'>
                <MethodControls params={params} onChange={handleChange} />
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border'>
              <Input
                type='date'
                label='Start Date'
                value={startDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
                max={subDaysISO(getTodayISO(), 1)}
                min={subDaysISO(getTodayISO(), 30)}
                className='w-full'
              />
              <Input
                type='date'
                label='End Date'
                value={endDate}
                onChange={(e) => handleDateChange('end', e.target.value)}
                max={subDaysISO(getTodayISO(), 1)}
                min={subDaysISO(getTodayISO(), 30)}
                className='w-full'
              />
            </div>
            <div className='flex justify-end'>
              <Button variant='primary' onClick={handleDateConfirm} disabled={!isValidRange}>
                Apply Range
              </Button>
            </div>
          </Card>
        )}

        {(error || swrError) && !isLoading && (
          <ErrorAlert
            message={error || swrError!.message}
            onDismiss={() => setError(null)}
            onRetry={() => mutate()}
          />
        )}
      </section>

      <section aria-labelledby='table-heading'>
        <h2 id='table-heading' className='sr-only'>
          Prayer Times Table
        </h2>
        <div className='overflow-x-auto rounded-xl border border-border'>
          {isLoading && !displayData && (
            <div className='p-8 text-center'>
              <LoadingSpinner size='lg' />
              <p className='mt-4 text-text-muted'>Loading prayer times...</p>
            </div>
          )}
          {displayData && displayData.length > 0 && (
            <table className='w-full text-sm' role='table'>
              <thead className='bg-surface'>
                <tr>
                  <th className='px-3 py-3 text-left font-semibold text-text sticky left-0 z-10 border-r border-border'>
                    Date
                  </th>
                  {obligatoryColumns.map((key) => (
                    <th key={key} className='px-3 py-3 text-center font-semibold text-text border-r border-border'>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                  ))}
                  <th className='px-3 py-3 text-center font-semibold text-text border-r border-border'>
                    Ishraq
                  </th>
                  <th className='px-3 py-3 text-center font-semibold text-text border-r border-border'>
                    Duha Start
                  </th>
                  <th className='px-3 py-3 text-center font-semibold text-text border-r border-border'>
                    Duha End
                  </th>
                  <th className='px-3 py-3 text-center font-semibold text-text'>
                    Awwabin
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((day, index) => {
                  const date = day.date;
                  const isNext = false;
                  const rowData = displayData[index];
                  const hasNafl = rowData.ishraq || rowData.duha_start || rowData.duha_end || rowData.awwabin_start || rowData.awwabin_end;
                  
                  return (
                    <React.Fragment key={date}>
                      <tr className={cn('border-t border-border hover:bg-surface/50', index % 2 === 0 && 'bg-background')}>
                        <td className='px-3 py-3 font-medium text-text sticky left-0 z-10 border-r border-border'>
                          <div className='flex flex-col'>
                            <span>{formatDateWithHijri(date)}</span>
                          </div>
                        </td>
                        {obligatoryColumns.map((key) => (
                          <td key={key} className='px-3 py-2 text-center text-sm font-mono border-r border-border'>
                            {rowData[key] ? rowData[key]!.slice(0, 5) : '—'}
                          </td>
                        ))}
                        <td className='px-3 py-2 text-center text-sm font-mono border-r border-border'>
                          {rowData.ishraq ? rowData.ishraq.slice(0, 5) : '—'}
                        </td>
                        <td className='px-3 py-2 text-center text-sm font-mono border-r border-border'>
                          {rowData.duha_start ? rowData.duha_start.slice(0, 5) : '—'}
                        </td>
                        <td className='px-3 py-2 text-center text-sm font-mono border-r border-border'>
                          {rowData.duha_end ? rowData.duha_end.slice(0, 5) : '—'}
                        </td>
                        <td className='px-3 py-2 text-center text-sm font-mono'>
                          {rowData.awwabin_start && rowData.awwabin_end
                            ? `${rowData.awwabin_start.slice(0, 5)} – ${rowData.awwabin_end.slice(0, 5)}`
                            : '—'}
                        </td>
                      </tr>
                      {hasNafl && (
                        <tr className={cn('border-t border-border', index % 2 === 0 && 'bg-background')}>
                          <td colSpan={12} className='p-0'>
                            <div
                              className={cn(
                                'overflow-hidden transition-all duration-200 ease-out bg-surface/50 border-t border-border',
                                expandedRow === date ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                              )}
                            >
                              <div className='p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs'>
                                <div className='space-y-1'>
                                  <p className='text-text-muted uppercase tracking-wider font-semibold'>Elevation Angles</p>
                                  {rowData.ishraq_elevation !== null && rowData.ishraq_elevation !== undefined && (
                                    <p className='text-text'>Ishraq: {rowData.ishraq_elevation}°</p>
                                  )}
                                  {rowData.duha_start_elevation !== null && rowData.duha_start_elevation !== undefined && (
                                    <p className='text-text'>Duha Start: {rowData.duha_start_elevation}°</p>
                                  )}
                                  <p className='text-text'>Nafl Method: {rowData.nafl_method || '—'}</p>
                                </div>
                                <div className='space-y-1'>
                                  <p className='text-text-muted uppercase tracking-wider font-semibold'>Ishraq</p>
                                  <p className='text-text font-mono'>{rowData.ishraq ? rowData.ishraq.slice(0, 5) : '—'}</p>
                                  <p className='text-text-muted'>(Sunrise + ~20 min)</p>
                                </div>
                                <div className='space-y-1'>
                                  <p className='text-text-muted uppercase tracking-wider font-semibold'>Duha</p>
                                  <p className='text-text font-mono'>
                                    {rowData.duha_start ? rowData.duha_start.slice(0, 5) : '—'} – {rowData.duha_end ? rowData.duha_end.slice(0, 5) : '—'}
                                  </p>
                                  <p className='text-text-muted'>(Forenoon prayer window)</p>
                                </div>
                                <div className='space-y-1'>
                                  <p className='text-text-muted uppercase tracking-wider font-semibold'>Awwabin</p>
                                  <p className='text-text font-mono'>
                                    {rowData.awwabin_start ? rowData.awwabin_start.slice(0, 5) : '—'} – {rowData.awwabin_end ? rowData.awwabin_end.slice(0, 5) : '—'}
                                  </p>
                                  <p className='text-text-muted'>(6 rak'ahs after Maghrib)</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
          {displayData && displayData.length === 0 && !isLoading && (
            <div className='p-8 text-center text-text-muted'>
              No prayer times data available for this range.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function validateDateRangeLocal(startDate: string, endDate: string): { valid: boolean; error?: string } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date(getTodayISO());

  if (start > end) {
    return { valid: false, error: 'End date must be after or equal to start date' };
  }

  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  if (diffDays > 30) {
    return { valid: false, error: 'Date range cannot exceed 30 days' };
  }

  if (end > today) {
    return { valid: false, error: 'End date cannot be in the future' };
  }

  return { valid: true };
}