import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  if (!q) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&limit=5&accept-language=en`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mawaqit/1.0 (mawaqit-web; contact@mawaqit.app)',
      },
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Search failed' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Proxy search error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
