import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  if (!BASE_URL) {
    return NextResponse.json(
      { code: 'E_NO_BACKEND_BASE', message: 'NEXT_PUBLIC_BASE_URL is not set' },
      { status: 500 },
    );
  }

  const backendUrl = new URL(`/api/courses/${params.id}`, BASE_URL);

  const upstream = await fetch(backendUrl.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const contentType = upstream.headers.get('content-type') ?? '';
  const body = await upstream.text();

  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      'content-type': contentType || 'application/json; charset=utf-8',
    },
  });
}
