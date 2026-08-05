'use client';

import useSWR, { mutate, SWRConfiguration, SWRResponse } from 'swr';
import { apiClient } from '../lib/api';
import type {
  SingleDayParams,
  DateRangeParams,
  PrayerTimesResponse,
} from '../types/prayer-times';

const fetcher = async (params: SingleDayParams): Promise<PrayerTimesResponse> => {
  return apiClient.getPrayerTimes(params);
};

const rangeFetcher = async (params: DateRangeParams): Promise<PrayerTimesResponse[]> => {
  const data = await apiClient.getPrayerTimesRange(params);
  return data.items;
};

const methodsFetcher = async (): Promise<string[]> => {
  return apiClient.getMethods();
};

export interface UsePrayerTimesOptions extends SWRConfiguration<PrayerTimesResponse, Error> {
  fallbackData?: PrayerTimesResponse;
}

export interface UsePrayerTimesRangeOptions extends SWRConfiguration<PrayerTimesResponse[], Error> {
  fallbackData?: PrayerTimesResponse[];
}

export interface UsePrayerTimesMethodsOptions extends SWRConfiguration<string[], Error> {
  fallbackData?: string[];
}

export function usePrayerTimes(
  params: SingleDayParams | null,
  options: UsePrayerTimesOptions = {}
): SWRResponse<PrayerTimesResponse, Error> & { mutate: () => Promise<PrayerTimesResponse | undefined> } {
  const key = params ? ['prayer-times', params] : null;
  const { fallbackData, ...swrOptions } = options;

  const swr = useSWR<PrayerTimesResponse, Error>(
    key,
    () => fetcher(params!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      fallbackData,
      ...swrOptions,
    }
  );

  const mutateFn = async () => {
    if (!key) return undefined;
    return mutate(key);
  };

  return { ...swr, mutate: mutateFn };
}

export function usePrayerTimesRange(
  params: DateRangeParams | null,
  options: UsePrayerTimesRangeOptions = {}
): SWRResponse<PrayerTimesResponse[], Error> & { mutate: () => Promise<PrayerTimesResponse[] | undefined> } {
  const key = params ? ['prayer-times-range', params] : null;
  const { fallbackData, ...swrOptions } = options;

  const swr = useSWR<PrayerTimesResponse[], Error>(
    key,
    () => rangeFetcher(params!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      fallbackData,
      ...swrOptions,
    }
  );

  const mutateFn = async () => {
    if (!key) return undefined;
    return mutate(key);
  };

  return { ...swr, mutate: mutateFn };
}

export function useTodayPrayerTimes(
  params: Omit<SingleDayParams, 'prayer_date'> | null,
  options: UsePrayerTimesOptions = {}
): SWRResponse<PrayerTimesResponse, Error> & { mutate: () => Promise<PrayerTimesResponse | undefined> } {
  const key = params ? ['prayer-times-today', params] : null;
  const { fallbackData, ...swrOptions } = options;

  const swr = useSWR<PrayerTimesResponse, Error>(
    key,
    () => apiClient.getTodayPrayerTimes(params!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      fallbackData,
      ...swrOptions,
    }
  );

  const mutateFn = async () => {
    if (!key) return undefined;
    return mutate(key);
  };

  return { ...swr, mutate: mutateFn };
}

export function usePrayerTimesMethods(
  options: UsePrayerTimesMethodsOptions = {}
): SWRResponse<string[], Error> & { mutate: () => Promise<string[] | undefined> } {
  const key = ['prayer-times-methods'];
  const { fallbackData, ...swrOptions } = options;

  const swr = useSWR<string[], Error>(
    key,
    methodsFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000,
      fallbackData,
      ...swrOptions,
    }
  );

  const mutateFn = async () => mutate(key);

  return { ...swr, mutate: mutateFn };
}

export { mutate } from 'swr';