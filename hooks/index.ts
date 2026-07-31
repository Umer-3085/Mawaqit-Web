export { useLocation, useLocationFromParams } from './useLocation';
export type { LocationParams } from '../types/prayer-times';

export {
  usePrayerTimes,
  usePrayerTimesRange,
  useTodayPrayerTimes,
  usePrayerTimesMethods,
  mutate,
} from './usePrayerTimes';
export type {
  UsePrayerTimesOptions,
  UsePrayerTimesRangeOptions,
  UsePrayerTimesMethodsOptions,
} from './usePrayerTimes';

export {
  useUpdateLocation,
  useResetLocation,
  useLocationMutations,
} from './useLocationMutations';

export { SWR_DEFAULTS, PRAYER_TIMES_SWR_CONFIG, METHODS_SWR_CONFIG, createSWRConfig, createPrayerTimesSWRConfig } from '../lib/swr-config';