'use client';

import { TodayPrayerTimesClient } from './TodayPrayerTimesClient';
import type { PrayerTimesResponse, LocationParams } from '@/types/prayer-times';

interface PrayerTimesClientWrapperProps {
  initialData: PrayerTimesResponse | null;
  initialParams: LocationParams;
  isDatePage?: boolean;
  dateParam?: string;
}

export function PrayerTimesClientWrapper({
  initialData,
  initialParams,
  isDatePage = false,
  dateParam,
}: PrayerTimesClientWrapperProps) {
  return (
    <TodayPrayerTimesClient
      initialData={initialData}
      initialParams={initialParams}
      isDatePage={isDatePage}
      dateParam={dateParam}
    />
  );
}