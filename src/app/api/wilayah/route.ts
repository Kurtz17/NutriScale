import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://emsifa.github.io/api-wilayah-indonesia/api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  let url = '';

  if (type === 'provinces') {
    url = `${BASE}/provinces.json`;
  } else if (type === 'regencies' && id) {
    url = `${BASE}/regencies/${id}.json`;
  } else if (type === 'districts' && id) {
    url = `${BASE}/districts/${id}.json`;
  } else if (type === 'villages' && id) {
    url = `${BASE}/villages/${id}.json`;
  } else {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
  }

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`Upstream error: ${res.status} ${res.statusText} — ${url}`);
      return NextResponse.json(
        { error: `Upstream error: ${res.status}` },
        { status: res.status },
      );
    }

    const text = await res.text(); // baca sebagai text dulu
    console.log(`[wilayah] fetched ${url} → ${text.slice(0, 100)}`);

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[wilayah] fetch error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
