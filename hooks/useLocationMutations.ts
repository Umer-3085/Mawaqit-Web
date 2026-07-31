'use client';

import { useCallback } from 'react';
import { mutate } from 'swr';
import { useLocation } from './useLocation';
import type { LocationParams } from '../types/prayer-times';

const PRAYER_TIMES_KEYS = [
  'prayer-times',
  'prayer-times-range',
  'prayer-times-today',
] as const;

export function useUpdateLocation() {
  const { location, updateLocation: baseUpdateLocation } = useLocation();

  const updateLocation = useCallback(
    async (updates: Partial<LocationParams>): Promise<LocationParams> => {
      const newLocation = { ...location, ...updates };

      await Promise.all([
mutate(
        (key): boolean => Array.isArray(key) && PRAYER_TIMES_KEYS.includes(key[0] as typeof PRAYER_TIMES_KEYS[number]),
        undefined,
        { revalidate: true }
      ),
        baseUpdateLocation(updates),
      ]);

      return newLocation;
    },
    [location, baseUpdateLocation]
  );

  return { updateLocation };
}

export function useResetLocation() {
  const { resetLocation: baseResetLocation } = useLocation();

  const resetLocation = useCallback(async (): Promise<void> => {
    await Promise.all([
      mutate(
        (key): boolean => Array.isArray(key) && PRAYER_TIMES_KEYS.includes(key[0] as typeof PRAYER_TIMES_KEYS[number]),
        undefined,
        { revalidate: true }
      ),
      baseResetLocation(),
    ]);
  }, [baseResetLocation]);

  return { resetLocation };
}

export function useLocationMutations() {
  const { updateLocation } = useUpdateLocation();
  const { resetLocation } = useResetLocation();

  return { updateLocation, resetLocation };
}