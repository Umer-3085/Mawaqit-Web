'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LocationParams, CalculationMethod, Madhab, HighLatitudeRule, NaflMethod } from '../types/prayer-times';

const DEFAULT_LOCATION: LocationParams = {
  lat: 33.6844,
  lng: 73.0479,
  timezone: 'Asia/Karachi',
  calculation_method: 'MUSLIM_WORLD_LEAGUE',
  madhab: 'SHAFI',
  high_latitude_rule: 'MIDDLE_OF_THE_NIGHT',
  nafl_method: 'QUARTER_DAY',
};

const STORAGE_KEY = 'mawaqit-location';

function getInitialLocation(): LocationParams {
  if (typeof window === 'undefined') return DEFAULT_LOCATION;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_LOCATION, ...parsed };
    }
  } catch {
  }
  return DEFAULT_LOCATION;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationParams>(getInitialLocation);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  const updateLocation = useCallback((updates: Partial<LocationParams>) => {
    const newLocation = { ...location, ...updates };
    setLocation(newLocation);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
      } catch {
      }
    }
  }, [location]);

  const resetLocation = useCallback(() => {
    setLocation(DEFAULT_LOCATION);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
      }
    }
  }, []);

  return { location, updateLocation, resetLocation, hydrated };
}

export function useLocationFromParams(searchParams: URLSearchParams): LocationParams {
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const timezone = searchParams.get('timezone');
  const calculation_method = searchParams.get('calculation_method') || searchParams.get('method');
  const madhab = searchParams.get('madhab');
  const high_latitude_rule = searchParams.get('highLat') || searchParams.get('high_latitude_rule');
  const nafl_method = searchParams.get('naflMethod') || searchParams.get('nafl_method');

  if (lat && lng) {
    return {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      timezone: timezone || DEFAULT_LOCATION.timezone,
      calculation_method: (calculation_method as CalculationMethod) || DEFAULT_LOCATION.calculation_method,
      madhab: (madhab as Madhab) || DEFAULT_LOCATION.madhab,
      high_latitude_rule: (high_latitude_rule as HighLatitudeRule) || DEFAULT_LOCATION.high_latitude_rule,
      nafl_method: (nafl_method as NaflMethod) || DEFAULT_LOCATION.nafl_method,
    };
  }

  return DEFAULT_LOCATION;
}