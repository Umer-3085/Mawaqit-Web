'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { LocationInput } from './LocationInput';
import { cn } from '@/components/ui/utils';

const LocationMap = dynamic(
  () => import('./LocationMap').then((mod) => mod.LocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[300px] h-[300px] w-full bg-surface-elevated/40 animate-pulse rounded-xl border border-border/40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-xs text-text-muted">Loading map component...</span>
        </div>
      </div>
    ),
  }
);

interface LocationPickerProps {
  lat: number;
  lng: number;
  timezone: string;
  onChange: (updates: { lat?: number; lng?: number; timezone?: string; cityName?: string }) => void;
  onGeolocation: () => void;
  geolocationLoading?: boolean;
  error?: string | null;
  disabled?: boolean;
  cityName?: string;
}

const STORAGE_KEY = 'mawaqit-location-tab';

function getInitialTab(): 'manual' | 'map' {
  if (typeof window === 'undefined') return 'manual';
  return (localStorage.getItem(STORAGE_KEY) as 'manual' | 'map') || 'manual';
}

export function LocationPicker({
  lat,
  lng,
  timezone,
  onChange,
  onGeolocation,
  geolocationLoading = false,
  error,
  disabled = false,
  cityName,
}: LocationPickerProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'map'>(getInitialTab);
  const [mapLat, setMapLat] = useState(lat);
  const [mapLng, setMapLng] = useState(lng);
  const [prevLat, setPrevLat] = useState(lat);
  const [prevLng, setPrevLng] = useState(lng);
  const [mapAddress, setMapAddress] = useState<string>('');

  // Synchronize state during render phase if props change
  if (lat !== prevLat || lng !== prevLng) {
    setPrevLat(lat);
    setPrevLng(lng);
    setMapLat(lat);
    setMapLng(lng);
  }

  const handleTabChange = useCallback((tab: 'manual' | 'map') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, tab);
    }
  }, []);

  const handleMapLocationChange = useCallback((newLat: number, newLng: number, address?: string) => {
    setMapLat(newLat);
    setMapLng(newLng);
    if (address) setMapAddress(address);
    onChange({ lat: newLat, lng: newLng, cityName: address });
  }, [onChange]);

  const handleInputChange = useCallback((updates: { lat?: number; lng?: number; timezone?: string; cityName?: string }) => {
    if (updates.lat !== undefined) setMapLat(updates.lat);
    if (updates.lng !== undefined) setMapLng(updates.lng);
    onChange(updates);
  }, [onChange]);

  return (
    <div className="space-y-4">
      {/* Segmented Tab Control */}
      <div className="flex gap-1 p-1 bg-surface-elevated/60 border border-border/40 rounded-lg">
        <button
          type="button"
          onClick={() => handleTabChange('manual')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-out',
            activeTab === 'manual'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-muted hover:text-text hover:bg-surface/60'
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Manual
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('map')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-out',
            activeTab === 'map'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-muted hover:text-text hover:bg-surface/60'
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Map
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'manual' && (
          <LocationInput
            lat={mapLat}
            lng={mapLng}
            timezone={timezone}
            onChange={handleInputChange}
            onGeolocation={onGeolocation}
            geolocationLoading={geolocationLoading}
            error={error}
            disabled={disabled}
            cityName={cityName || mapAddress}
          />
        )}

        {activeTab === 'map' && (
          <div className="space-y-2">
            <p className="text-xs text-text-muted">
              Click on map to set location. Drag marker to fine-tune.
            </p>
            <LocationMap
              lat={mapLat}
              lng={mapLng}
              onLocationChange={handleMapLocationChange}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </div>
  );
}