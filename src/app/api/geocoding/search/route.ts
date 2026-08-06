import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  // 1. Try Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5&accept-language=en`;
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
    console.warn('Nominatim search failed, falling back to Photon...', err);
  }

  // 2. Fallback to Photon
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5`;
    const res = await fetch(url);
    if (res.ok) {
      const geojson = await res.json();
      const mapped = (geojson.features || []).map((feature: any) => {
        const props = feature.properties || {};
        const coords = feature.geometry?.coordinates || [0, 0];
        const displayName = [props.name, props.street, props.city, props.state, props.country]
          .filter(Boolean)
          .join(', ');
        return {
          lat: coords[1],
          lon: coords[0],
          display_name: displayName,
          address: {
            city: props.city || props.town || props.village || props.suburb,
            country: props.country,
          },
        };
      });
      return NextResponse.json(mapped);
    }
  } catch (err) {
    console.error('Photon search failed:', err);
  }

  return NextResponse.json({ error: 'Search failed' }, { status: 500 });
}
