import { apiClient } from '@/lib/api';
import { TodayPrayerTimesClient } from '@/components/prayer-times';
import type { LocationParams } from '@/types/prayer-times';

interface PageProps {
  searchParams: Promise<{
    lat?: string;
    lng?: string;
    timezone?: string;
    method?: string;
    madhab?: string;
    highLat?: string;
    naflMethod?: string;
  }>;
}

function parseSearchParams(params: Awaited<PageProps['searchParams']>): LocationParams {
  const DEFAULT_LOCATION: LocationParams = {
    lat: 33.6844,
    lng: 73.0479,
    timezone: 'Asia/Karachi',
    method: 'MUSLIM_WORLD_LEAGUE',
    nafl_method: 'QUARTER_DAY',
  };

  const lat = params.lat ? parseFloat(params.lat) : DEFAULT_LOCATION.lat;
  const lng = params.lng ? parseFloat(params.lng) : DEFAULT_LOCATION.lng;
  const timezone = params.timezone || DEFAULT_LOCATION.timezone;
  const method = (params.method as LocationParams['method']) || DEFAULT_LOCATION.method;
  const nafl_method = (params.naflMethod as LocationParams['nafl_method']) || DEFAULT_LOCATION.nafl_method;

  return {
    lat: isNaN(lat) ? DEFAULT_LOCATION.lat : lat,
    lng: isNaN(lng) ? DEFAULT_LOCATION.lng : lng,
    timezone,
    method,
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
    initialData = null as any;
  }

  return <TodayPrayerTimesClient initialData={initialData} initialParams={location} />;
}