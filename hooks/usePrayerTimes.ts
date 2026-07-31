'use client';

import useSWR from 'swr';
import { apiClient } from '../lib/api';
import type { SingleDayParams, DateRangeParams, PrayerTimesResponse, PrayerTimesRangeResponse } from '../types/prayer-times';

const fetcher = async (params: SingleDayParams) => {
  const data = await apiClient.getPrayerTimes(params);
  return data;
};

const rangeFetcher = async (params: DateRangeParams) => {
  const data = await apiClient.getPrayerTimesRange(params);
  return data.items;
};

export function usePrayerTimes(params: SingleDayParams | null) {
  const key = params ? ['prayer-times', params] : null;
  return useSWR<PrayerTimesResponse>(key, () => fetcher(params!), {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}

export function usePrayerTimesRange(params: DateRangeParams | null) {
  const key = params ? ['prayer-times-range', params] : null;
  return useSWR<PrayerTimesResponse[]>(key, () => rangeFetcher(params!), {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}

export function useTodayPrayerTimes(params: Omit<SingleDayParams, 'prayer_date'> | null) {
  const key = params ? ['prayer-times-today', params] : null;
  return useSWR<PrayerTimesResponse>(key, () => apiClient.getTodayPrayerTimes(params!), {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}