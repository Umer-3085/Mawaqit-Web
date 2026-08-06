import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  // 1. Try Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mawaqit/1.0 (mawaqit-web; contact@mawaqit.app)',
      },
    });
    if (res.ok && res.status !== 429) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.warn('Nominatim reverse failed, falling back to Photon...', err);
  }

  // 2. Fallback to Photon
  try {
    const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`;
    const res = await fetch(url);
    if (res.ok) {
      const geojson = await res.json();
      const feature = geojson.features?.[0];
      if (feature) {
        const props = feature.properties || {};
        const displayName = [props.name, props.street, props.city, props.state, props.country]
          .filter(Boolean)
          .join(', ');
        const mapped = {
          display_name: displayName,
          address: {
            city: props.city || props.town || props.village || props.suburb,
            country: props.country,
          },
        };
        return NextResponse.json(mapped);
      }
    }
  } catch (err) {
    console.error('Photon reverse failed:', err);
  }

  return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
}
