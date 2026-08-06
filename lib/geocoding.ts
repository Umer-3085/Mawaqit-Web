export interface GeocodeResult {
  city?: string;
  country?: string;
  displayName?: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  try {
    const url = `/api/geocoding/reverse?lat=${lat}&lng=${lng}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address || {};
    return {
      city: addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || addr.county,
      country: addr.country,
      displayName: data.display_name,
    };
  } catch {
    return null;
  }
}