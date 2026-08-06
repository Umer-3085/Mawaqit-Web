export interface GeocodeResult {
  city?: string;
  country?: string;
  displayName?: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mawaqit/1.0 (mawaqit.app)' },
    });
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