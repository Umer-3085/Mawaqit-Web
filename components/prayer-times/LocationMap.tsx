'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/components/ui/utils';
import { reverseGeocode } from '@/lib/geocoding';

// Fix default marker icon
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
  disabled?: boolean;
  className?: string;
}

function MapEvents({ onLocationChange }: { onLocationChange: (lat: number, lng: number, address?: string) => void }) {
  const map = useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function GeolocationControl({ onLocate }: { onLocate: () => void }) {
  const map = useMapEvents({});
  
  return (
    <div className="leaflet-control leaflet-bar leaflet-control-custom" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
      <Button
        variant="outline"
        size="sm"
        onClick={onLocate}
        className="shadow-lg"
        title="Use my location"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </Button>
    </div>
  );
}

export function LocationMap({ lat, lng, onLocationChange, disabled = false, className }: LocationMapProps) {
  const [position, setPosition] = useState({ lat, lng });
  const [address, setAddress] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ lat: number; lng: number; displayName: string }>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    setPosition({ lat, lng });
  }, [lat, lng]);

  // Reverse geocode on position change
  useEffect(() => {
    let cancelled = false;
    const fetchAddress = async () => {
      const result = await reverseGeocode(position.lat, position.lng);
      if (!cancelled && result) {
        const addr = result.displayName || `${result.city || ''}, ${result.country || ''}`.trim();
        setAddress(addr);
        onLocationChange(position.lat, position.lng, addr);
      }
    };
    fetchAddress();
    return () => { cancelled = true; };
  }, [position.lat, position.lng, onLocationChange]);

  // Forward geocode search with debounce
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=en`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mawaqit/1.0' } });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSearchResults(data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
      })));
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => handleSearch(value), 300);
  };

  const selectResult = (result: { lat: number; lng: number; displayName: string }) => {
    setPosition({ lat: result.lat, lng: result.lng });
    setSearchQuery(result.displayName);
    setShowResults(false);
    setSearchResults([]);
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setMapError('Geolocation not supported');
      return;
    }
    setMapError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(newPos);
        if (mapRef.current) {
          mapRef.current.setView([newPos.lat, newPos.lng], 15);
        }
      },
      (err) => setMapError(err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative" style={{ height: '100%', minHeight: '300px', maxHeight: '50vh', borderRadius: '0.75rem', overflow: 'hidden' }}>
        <MapContainer
          ref={mapRef}
          center={[position.lat, position.lng]}
          zoom={13}
          scrollWheelZoom={!disabled}
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[position.lat, position.lng]}
            draggable={!disabled}
            onDragend={(e) => {
              const { lat, lng } = e.target.getLatLng();
              setPosition({ lat, lng });
            }}
          >
            <Popup>
              <div className="p-1 text-sm">
                <p className="font-medium">{address || 'Selected location'}</p>
                <p className="text-xs text-muted-foreground">
                  {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
          <MapEvents onLocationChange={onLocationChange} />
          <GeolocationControl onLocate={handleLocate} />
        </MapContainer>

        {mapError && (
          <div className="absolute bottom-2 left-2 right-2 bg-red-500/90 text-white text-xs px-3 py-2 rounded shadow-lg animate-fade-in-up">
            {mapError}
          </div>
        )}
      </div>

      {/* Search Control */}
      <div className="mt-3 relative">
        <div className="relative">
          <Input
            label="Search Location"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Search city, address, landmark..."
            disabled={disabled}
            className="pr-10"
          />
          {searchLoading && (
            <LoadingSpinner size="sm" className="absolute right-3 top-[38px] text-text-muted" />
          )}
        </div>
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                onClick={() => selectResult(result)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-surface-elevated transition-colors border-b last:border-0"
              >
                {result.displayName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Address Display */}
      {address && (
        <div className="mt-3 p-3 bg-surface/50 border border-border/40 rounded-lg">
          <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Address</p>
          <p className="text-sm text-text break-words">{address}</p>
          <p className="text-[11px] text-text-muted/60 mt-1 font-mono">
            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}