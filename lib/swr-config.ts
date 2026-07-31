import type { SWRConfiguration } from 'swr';

export const SWR_DEFAULTS: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 60000,
  refreshInterval: 0,
  revalidateOnReconnect: true,
  revalidateIfStale: true,
};

export const PRAYER_TIMES_SWR_CONFIG: SWRConfiguration = {
  ...SWR_DEFAULTS,
  dedupingInterval: 60000,
  refreshInterval: 300000,
};

export const METHODS_SWR_CONFIG: SWRConfiguration = {
  ...SWR_DEFAULTS,
  dedupingInterval: 3600000,
  refreshInterval: 0,
};

export function createSWRConfig<T>(overrides: SWRConfiguration<T> = {}): SWRConfiguration<T> {
  return { ...SWR_DEFAULTS, ...overrides };
}

export function createPrayerTimesSWRConfig<T>(overrides: SWRConfiguration<T> = {}): SWRConfiguration<T> {
  return { ...PRAYER_TIMES_SWR_CONFIG, ...overrides };
}