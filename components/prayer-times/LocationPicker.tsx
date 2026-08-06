'use client';

import { useState, useEffect, useCallback } from 'react';
import { LocationInput } from './LocationInput';
import { LocationMap } from './LocationMap';
import { cn } from '@/components/ui/utils';

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
  const [mapAddress, setMapAddress] = useState<string>('');

  useEffect(() => {
    setMapLat(lat);
    setMapLng(lng);
  }, [lat, lng]);

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
      {/* Tab Buttons */}
      <div className="flex gap-1 p-1 bg-surface/50 border border-border/40 rounded-lg">
        <button
          type="button"
          onClick={() => handleTabChange('manual')}
          className={cn(
            'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            activeTab === 'manual'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-muted hover:text-text'
          )}
        >
          Manual
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('map')}
          className={cn(
            'flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            activeTab === 'map'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-muted hover:text-text'
          )}
        >
          Map
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
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

      {/* City Name Display (shared) */}
      {(cityName || mapAddress) && (
        <div className="text-sm text-text-muted flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {cityName || mapAddress}
        </div>
      )}
    </div>
  );
}