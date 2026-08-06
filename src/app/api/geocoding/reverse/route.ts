import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mawaqit/1.0 (mawaqit-web; contact@mawaqit.app)',
      },
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Reverse geocode failed' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Proxy reverse geocode error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
