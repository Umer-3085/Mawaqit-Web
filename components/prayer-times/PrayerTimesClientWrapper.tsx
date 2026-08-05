'use client';

import { TodayPrayerTimesClient } from './TodayPrayerTimesClient';
import type { PrayerTimesResponse, LocationParams } from '@/types/prayer-times';

interface PrayerTimesClientWrapperProps {
  initialData: PrayerTimesResponse | null;
  initialParams: LocationParams;
}

export function PrayerTimesClientWrapper({
  initialData,
  initialParams,
}: PrayerTimesClientWrapperProps) {
  return (
    <TodayPrayerTimesClient
      initialData={initialData}
      initialParams={initialParams}
      isDatePage={false}
    />
  );
}