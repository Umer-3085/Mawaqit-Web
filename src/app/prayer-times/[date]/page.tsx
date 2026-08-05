import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '../../../../lib/api';
import { PrayerTimesClientWrapper } from '@/components/prayer-times/PrayerTimesClientWrapper';
import { PageContainer } from '@/components/layout/PageContainer';
import type { LocationParams } from '../../../../types/prayer-times';
import { formatDateWithHijri } from '../../../../lib/date-utils';

interface PageProps {
  params: Promise<{ date: string }>;
  searchParams: Promise<{
    lat?: string;
    lng?: string;
    timezone?: string;
    calculation_method?: string;
    method?: string;
    madhab?: string;
    highLat?: string;
    high_latitude_rule?: string;
    naflMethod?: string;
    nafl_method?: string;
  }>;
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) return false;
  const parts = dateStr.split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date instanceof Date &&
    !isNaN(date.getTime()) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
}

function parseSearchParams(params: Awaited<PageProps['searchParams']>): LocationParams {
  const DEFAULT_LOCATION: LocationParams = {
    lat: 33.6844,
    lng: 73.0479,
    timezone: 'Asia/Karachi',
    calculation_method: 'MUSLIM_WORLD_LEAGUE',
    madhab: 'SHAFI',
    high_latitude_rule: 'MIDDLE_OF_THE_NIGHT',
    nafl_method: 'QUARTER_DAY',
  };

  const lat = params.lat ? parseFloat(params.lat) : DEFAULT_LOCATION.lat;
  const lng = params.lng ? parseFloat(params.lng) : DEFAULT_LOCATION.lng;
  const timezone = params.timezone || DEFAULT_LOCATION.timezone;
  const calculation_method = (params.calculation_method || params.method || DEFAULT_LOCATION.calculation_method) as LocationParams['calculation_method'];
  const madhab = (params.madhab || DEFAULT_LOCATION.madhab) as LocationParams['madhab'];
  const high_latitude_rule = (params.highLat || params.high_latitude_rule || DEFAULT_LOCATION.high_latitude_rule) as LocationParams['high_latitude_rule'];
  const nafl_method = (params.naflMethod || params.nafl_method || DEFAULT_LOCATION.nafl_method) as LocationParams['nafl_method'];

  return {
    lat: isNaN(lat) ? DEFAULT_LOCATION.lat : lat,
    lng: isNaN(lng) ? DEFAULT_LOCATION.lng : lng,
    timezone,
    calculation_method,
    madhab,
    high_latitude_rule,
    nafl_method,
  };
}

export const revalidate = 86400;

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { date } = await params;
  const location = parseSearchParams(await searchParams);

  if (!isValidDate(date)) {
    return {
      title: 'Invalid Date — Mawaqit مواقيت',
    };
  }

  const formatted = formatDateWithHijri(date);

  const canonicalParams = new URLSearchParams();
  canonicalParams.set('lat', location.lat.toString());
  canonicalParams.set('lng', location.lng.toString());
  canonicalParams.set('timezone', location.timezone);
  canonicalParams.set('calculation_method', location.calculation_method);
  canonicalParams.set('madhab', location.madhab);
  canonicalParams.set('high_latitude_rule', location.high_latitude_rule);
  canonicalParams.set('nafl_method', location.nafl_method);

  const canonicalUrl = '/prayer-times/' + date + '?' + canonicalParams.toString();

  return {
    title: 'Prayer Times for ' + formatted.gregorian + ' — Mawaqit مواقيت',
    description: 'Calculated prayer times for ' + formatted.gregorian + ' (' + formatted.hijri + ') at your location using selected calculation methods.',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Prayer Times for ' + formatted.gregorian,
      description: 'Prayer times for ' + formatted.gregorian + ' (' + formatted.hijri + ')',
      url: canonicalUrl,
    },
  };
}

export default async function PrayerTimesDatePage({ params, searchParams }: PageProps) {
  const { date } = await params;
  const location = parseSearchParams(await searchParams);

  if (!isValidDate(date)) {
    notFound();
  }

  let initialData: Awaited<ReturnType<typeof apiClient.getPrayerTimes>>;
  try {
    initialData = await apiClient.getPrayerTimes({
      ...location,
      prayer_date: date,
    });
  } catch {
    initialData = null as never;
  }

return (
    <PageContainer>
      <PrayerTimesClientWrapper
        initialData={initialData}
        initialParams={location}
        isDatePage={true}
        dateParam={date}
      />
    </PageContainer>
  );
}
