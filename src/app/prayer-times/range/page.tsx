import { Metadata } from 'next';
import { apiClient } from '../../../../lib/api';
import { parseLocationParams, getTodayISO, subDaysISO } from '../../../../lib/date-utils';
import { PageContainer } from '@/components/layout/PageContainer';
import { RangePrayerTimesClient } from '@/components/prayer-times/RangePrayerTimesClient';
import type { PrayerTimesRangeResponse, DateRangeParams, LocationParams, CalculationMethod, Madhab, HighLatitudeRule, NaflMethod, PrayerTimesResponse } from '@/types/prayer-times';

export const revalidate = 3600;

const DEFAULT_DAYS = 7;

async function fetchRangeData(params: DateRangeParams): Promise<PrayerTimesRangeResponse | null> {
  try {
    return await apiClient.getPrayerTimesRange(params);
  } catch {
    return null;
  }
}

function getDefaultRange(): { startDate: string; endDate: string } {
  const endDate = getTodayISO();
  const startDate = subDaysISO(endDate, DEFAULT_DAYS - 1);
  return { startDate, endDate };
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const params = await searchParams;
  const start = Array.isArray(params['start_date']) ? params['start_date'][0] : params['start_date'];
  const end = Array.isArray(params['end_date']) ? params['end_date'][0] : params['end_date'];

  const { startDate, endDate } = getDefaultRange();
  const startDisplay = start || startDate;
  const endDisplay = end || endDate;

  return {
    title: `Prayer Times Range: ${startDisplay} to ${endDisplay} | Mawaqit`,
    description: `View prayer times for ${startDisplay} to ${endDisplay}`,
    openGraph: {
      title: `Prayer Times: ${startDisplay} - ${endDisplay}`,
      description: `Prayer times for date range`,
      type: 'website',
    },
  };
}

function validateDateRange(startDate: string, endDate: string): { valid: boolean; error?: string } {
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

export default async function RangePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const rawLocationParams = parseLocationParams(params);
  const locationParams: LocationParams = {
    lat: rawLocationParams.lat,
    lng: rawLocationParams.lng,
    timezone: rawLocationParams.timezone,
    calculation_method: rawLocationParams.calculation_method as CalculationMethod,
    madhab: rawLocationParams.madhab as Madhab,
    high_latitude_rule: rawLocationParams.high_latitude_rule as HighLatitudeRule,
    nafl_method: rawLocationParams.nafl_method as NaflMethod,
  };
  const rawStart = Array.isArray(params['start_date']) ? params['start_date'][0] : params['start_date'];
  const rawEnd = Array.isArray(params['end_date']) ? params['end_date'][0] : params['end_date'];

  const { startDate: defaultStart, endDate: defaultEnd } = getDefaultRange();
  const startDate = rawStart || defaultStart;
  const endDate = rawEnd || defaultEnd;

  const validation = validateDateRange(startDate, endDate);

  let initialData: PrayerTimesResponse[] | null = null;
  let initialError: string | null = null;

  if (!validation.valid) {
    initialError = validation.error || 'Invalid date range';
  } else {
    const rangeParams: DateRangeParams = {
      lat: locationParams.lat,
      lng: locationParams.lng,
      timezone: locationParams.timezone,
      calculation_method: locationParams.calculation_method as CalculationMethod,
      madhab: locationParams.madhab as Madhab,
      high_latitude_rule: locationParams.high_latitude_rule as HighLatitudeRule,
      nafl_method: locationParams.nafl_method as NaflMethod,
      start_date: startDate,
      end_date: endDate,
    };
    const rangeResponse = await fetchRangeData(rangeParams);
    initialData = rangeResponse?.items ?? null;
    if (!initialData) {
      initialError = 'Failed to load prayer times for this range';
    }
  }

  const canonicalParams = new URLSearchParams();
  canonicalParams.set('lat', locationParams.lat.toString());
  canonicalParams.set('lng', locationParams.lng.toString());
  canonicalParams.set('timezone', locationParams.timezone);
  canonicalParams.set('calculation_method', locationParams.calculation_method);
  canonicalParams.set('madhab', locationParams.madhab);
  canonicalParams.set('high_latitude_rule', locationParams.high_latitude_rule);
  canonicalParams.set('nafl_method', locationParams.nafl_method);
  canonicalParams.set('start_date', startDate);
  canonicalParams.set('end_date', endDate);
  const canonicalUrl = `/prayer-times/range?${canonicalParams.toString()}`;

  return (
    <>
      <link rel='canonical' href={canonicalUrl} />
      <main id='main-content'>
        <PageContainer>
          <RangePrayerTimesClient
            initialData={initialData}
            initialParams={locationParams}
            startDate={startDate}
            endDate={endDate}
            initialError={initialError}
            isValidRange={validation.valid}
          />
        </PageContainer>
      </main>
    </>
  );
}