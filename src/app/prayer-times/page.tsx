import { apiClient } from '../../../lib/api';
import { TodayPrayerTimesClient } from '@/components/prayer-times';
import type { LocationParams } from '../../../types/prayer-times'

interface PageProps {
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

export default async function PrayerTimesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const location = parseSearchParams(params);

  let initialData: Awaited<ReturnType<typeof apiClient.getTodayPrayerTimes>>;
  try {
    initialData = await apiClient.getTodayPrayerTimes(location);
  } catch {
    initialData = null as never;
  }

  return <TodayPrayerTimesClient initialData={initialData} initialParams={location} />;
}