import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getCookieValue(cookie: string, key: string) {
  const m = cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

async function proxy(req: Request, path: string[]) {
  try {
    const requestId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    console.log('[proxy] rid:', requestId);
    console.log('[proxy] method:', req.method);

    const contentType = req.headers.get('content-type') ?? '';
    const isMultipart = contentType.includes('multipart/form-data');

    const backendBase = process.env.BACKEND_BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL;
    console.log('[proxy] backendBase:', backendBase);

    if (!backendBase) {
      return NextResponse.json(
        { status: 'ERROR', message: 'BACKEND_BASE_URL 또는 NEXT_PUBLIC_BASE_URL 누락', requestId },
        { status: 500, headers: { 'x-proxy': 'next-route', 'x-request-id': requestId } },
      );
    }

    const urlObj = new URL(req.url);
    const base = backendBase.replace(/\/$/, '');
    const upstreamUrl = `${base}/api/${path.join('/')}${urlObj.search}`;
    console.log('[proxy] upstreamUrl:', upstreamUrl);
    console.log('[proxy] isMultipart:', isMultipart);

    const cookie = req.headers.get('cookie') ?? '';
    const accessToken = getCookieValue(cookie, 'accessToken');

    // multipart면 로그용으로만 clone을 formData로 파싱해서 내용 확인
    if (isMultipart && req.method !== 'GET' && req.method !== 'HEAD') {
      const fd = await req.clone().formData();
      console.log('[proxy] formData keys:', Array.from(fd.keys()));

      const lecturePart = fd.get('lecture');
      if (lecturePart instanceof Blob) {
        const lectureText = await lecturePart.text();
        console.log('[proxy] lecture JSON:', lectureText);
      } else {
        console.log('[proxy] lecture part missing or not Blob:', lecturePart);
      }

      const filePart = fd.get('multiFile');
      if (filePart instanceof File) {
        console.log('[proxy] multiFile:', {
          name: filePart.name,
          type: filePart.type,
          size: filePart.size,
        });
      } else {
        console.log('[proxy] multiFile missing or not File:', filePart);
      }
    }

    // 실제 업스트림 전달은 원본 body를 그대로(특히 multipart는 그대로가 중요)
    let body: BodyInit | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await req.arrayBuffer();
    }

    const headers: Record<string, string> = {
      cookie,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      accept: req.headers.get('accept') ?? '*/*',
      'x-request-id': requestId,
    };

    // boundary 포함해서 원본 content-type 그대로 전달
    if (contentType) headers['content-type'] = contentType;

    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers,
      body,
    });

    console.log('[proxy] upstream status:', upstream.status);

    const resBuf = await upstream.arrayBuffer();

    if (upstream.status >= 400) {
      const ct = upstream.headers.get('content-type') ?? '';
      if (ct.includes('application/json') || ct.includes('text')) {
        const text = new TextDecoder('utf-8').decode(resBuf);
        console.log('[proxy] upstream error body:', text.slice(0, 4000));
      } else {
        console.log('[proxy] upstream error body: (binary)', resBuf.byteLength, 'bytes');
      }
    }

    return new NextResponse(resBuf, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'application/json',
        'x-proxy': 'next-route',
        'x-request-id': requestId,
      },
    });
  } catch (e) {
    console.error('[api proxy error]', e);
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'api proxy crashed',
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 500, headers: { 'x-proxy': 'next-route' } },
    );
  }
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function POST(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PATCH(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function PUT(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
export async function DELETE(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
