'use server';

import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export type ApiResponse<T = unknown> = {
  status: string; // HTTP 상태 코드 (예: '200', '400' 등)
  code: string; // 에러 코드 (예: EG001, EU001 등)
  message: string; // 에러 메시지
  data: T; // 응답 데이터
};
/**
 * 인증 토큰을 포함하여 API 요청을 보냄
 *
 * @param endpoint API 엔드포인트
 * @param options fetch 옵션
 */

const LOG_LABELS = {
  REQUEST_FAILED: '[fetchApi] Request failed (요청 실패)',
  API_ERROR_CODE: '[fetchApi] API error code (서버 에러 코드)',
  UNEXPECTED_ERROR: '[fetchApi] Unexpected error (예상치 못한 오류)',
} as const;

type LogSchema = {
  '요청(request)': {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: string;
  };
  '응답(response)': {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    bodyRaw?: string;
    bodyJson?: unknown;
  };
  '오류(error)'?: {
    name?: string;
    message: string;
    stack?: string;
    cause?: unknown;
  };
};

export async function fetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!BASE_URL) throw new Error('NEXT_PUBLIC_BASE_URL 누락');

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  // 인증 헤더 설정
  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`); // 인증 토큰 포함
  }

  // JSON 요청일 때만 Content-Type 기본 부여
  if (!isFormData) {
    const hasContentType = headers.get('Content-Type');
    if (!hasContentType) headers.set('Content-Type', 'application/json');
  } else {
    // FormData면 Content-Type을 절대 직접 넣지 않음 (boundary 자동 설정 필요)
    headers.delete('Content-Type');
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  // "최종" 요청 스냅샷 (에러 시 출력용)
  const debugInfo: FetchDebugInfo = {
    url,
    method: (options.method || 'GET').toUpperCase(),
    requestHeaders: maskSensitiveHeaders(headersToObject(headers)),
    requestBodyPreview: buildBodyPreview(options.body, isFormData),
  };

  const buildLogPayload = (extra?: LogSchema['오류(error)']): LogSchema => ({
    '요청(request)': {
      url: debugInfo.url,
      method: debugInfo.method,
      headers: debugInfo.requestHeaders,
      body: debugInfo.requestBodyPreview,
    },
    '응답(response)': {
      status: debugInfo.status,
      statusText: debugInfo.statusText,
      headers: debugInfo.responseHeaders,
      bodyRaw: debugInfo.responseBodyRaw,
      bodyJson: debugInfo.responseBodyJson,
    },
    ...(extra
      ? {
          '오류(error)': extra,
        }
      : {}),
  });

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      ...options,
      headers,
    });

    // 응답 헤더 캡쳐
    debugInfo.status = response.status;
    debugInfo.statusText = response.statusText;
    debugInfo.responseHeaders = maskSensitiveHeaders(headersToObject(response.headers));

    // 응답 바디는 "한 번만" 읽을 수 있음 - 먼저 text로 읽고, JSON이면 파싱까지 시도
    const raw = await response.text();
    debugInfo.responseBodyRaw = raw?.length > 8000 ? raw.slice(0, 8000) + '...(truncated)' : raw;

    const contentType = response.headers.get('content-type') ?? '';
    let resJson = null;

    if (contentType.includes('application/json')) {
      try {
        resJson = raw ? JSON.parse(raw) : null;
        debugInfo.responseBodyJson = resJson;
      } catch (e) {
        // JSON인데 파싱 실패한 경우도 로그에 남기기
        debugInfo.responseBodyJson = { parseError: String(e) };
      }
    } else {
      // JSON이 아니면 raw만 남기고, 최소한의 형태만 맞춰둠
      resJson = { code: 'E_NON_JSON', message: raw };
    }

    // HTTP 에러
    if (!response.ok) {
      // 만약 응답이 401 (리프레시 토큰 만료)일 경우 -> 재로그인
      if (response.status === 401) {
        cookieStore.delete('accessToken'); // 재로그인
        cookieStore.delete('refreshToken');
        console.error('리프레시 토큰이 만료되었습니다. 다시 로그인이 필요합니다.');
      }

      // 요청/응답 전체 로그
      console.error(LOG_LABELS.REQUEST_FAILED, buildLogPayload());

      const code = (resJson && resJson.code) || 'NO_CODE';
      const message = (resJson && resJson.message) || response.statusText || 'Unknown';

      throw new FetchApiError(`[${response.status} (${code}) - ${message}]`, debugInfo);
    }

    // 응답 헤더에 새로운 액세스 토큰이 있다면 쿠키 갱신
    const newAccessToken = response.headers.get('Authorization');
    if (newAccessToken) {
      cookieStore.set('accessToken', newAccessToken, {
        httpOnly: true,
      });
    }

    // 규격 에러 코드(E*) 처리
    if (typeof resJson?.code === 'string' && resJson.code.startsWith('E')) {
      // 규격 에러 출력
      console.error(
        LOG_LABELS.API_ERROR_CODE,
        buildLogPayload({
          name: 'ApiErrorCode',
          message: resJson.message ?? '서버 에러 코드(E*)가 반환되었습니다.',
        }),
      );
      throw new FetchApiError(resJson.message, debugInfo);
    }

    return (resJson?.data ?? resJson) as T;
  } catch (error: unknown) {
    // 이미 FetchApiError면 중복 로그 줄이기 (원하면 다시 찍어도 됨)
    if (error instanceof FetchApiError) throw error;

    // 예상치 못한 오류 출력
    const errObj =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
            cause: error.cause,
          }
        : {
            message: String(error),
          };

    console.error(LOG_LABELS.UNEXPECTED_ERROR, buildLogPayload(errObj));

    if (error instanceof Error) {
      throw new FetchApiError(error.message, debugInfo, error);
    }
    throw new FetchApiError('알 수 없는 오류가 발생했습니다.', debugInfo, error);
  }
}

/**
 * GET 요청을 위한 fetchApi wrapper
 *
 * @param endpoint API 엔드포인트
 * @param options fetch 옵션
 */
export async function getApi<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return fetchApi<T>(endpoint, { method: 'GET', ...options });
}

/**
 * POST 요청을 위한 fetchApi wrapper
 *
 * @param endpoint API 엔드포인트
 * @param data 요청 데이터
 */
export async function postApi<T = unknown>(
  endpoint: string,
  data?: unknown,
  options: RequestInit = {},
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * PUT 요청을 위한 fetchApi wrapper
 *
 * @param endpoint API 엔드포인트
 * @param data 요청 데이터
 */
export async function putApi<T = unknown>(
  endpoint: string,
  data: unknown,
  options: RequestInit = {},
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * DELETE 요청을 위한 fetchApi wrapper
 *
 * @param endpoint API 엔드포인트
 */
export async function deleteApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  return fetchApi<T>(endpoint, { method: 'DELETE', ...options });
}

/**
 * PATCH 요청을 위한 fetchApi wrapper
 *
 * @param endpoint API 엔드포인트
 * @param data 요청 데이터
 */
export async function patchApi<T = unknown>(
  endpoint: string,
  data?: unknown,
  options: RequestInit = {},
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options,
  });
}

type FetchDebugInfo = {
  url: string;
  method: string;
  requestHeaders: Record<string, string>;
  requestBodyPreview?: string;
  status?: number;
  statusText?: string;
  responseHeaders?: Record<string, string>;
  responseBodyRaw?: string; // 원문(텍스트)
  responseBodyJson?: unknown; // JSON 파싱 결과
};

function headersToObject(headers: Headers): Record<string, string> {
  return Object.fromEntries(headers.entries());
}

function maskSensitiveHeaders(headers: Record<string, string>) {
  const masked = { ...headers };

  const mask = (v?: string | null) => (v ? v.replace(/^(.{0,8}).+$/, '$1***') : (v ?? ''));

  // 요청/응답에서 흔히 민감한 것들 마스킹
  if (masked.Authorization) masked.Authorization = mask(masked.Authorization);
  if (masked.authorization) masked.authorization = mask(masked.authorization);

  if (masked.Cookie) masked.Cookie = '***';
  if (masked.cookie) masked.cookie = '***';

  if (masked['Set-Cookie']) masked['Set-Cookie'] = '***';
  if (masked['set-cookie']) masked['set-cookie'] = '***';

  return masked;
}

function buildBodyPreview(body: RequestInit['body'], isFormData: boolean): string | undefined {
  if (!body) return undefined;

  // FormData는 그대로 stringify 불가 → 어떤 키가 있는지만 보여주기
  if (isFormData && body instanceof FormData) {
    const keys = Array.from(body.keys());
    return `FormData(keys=${JSON.stringify(keys)})`;
  }

  if (typeof body === 'string') {
    return body.length > 2000 ? body.slice(0, 2000) + '...(truncated)' : body;
  }

  // ArrayBuffer/Blob/Stream 등은 미리보기 제한
  if (body instanceof ArrayBuffer) return `ArrayBuffer(byteLength=${body.byteLength})`;
  if (typeof Blob !== 'undefined' && body instanceof Blob)
    return `Blob(size=${body.size}, type=${body.type})`;

  // ReadableStream 등은 안전하게 타입만
  return `Body(type=${Object.prototype.toString.call(body)})`;
}

class FetchApiError extends Error {
  debug: FetchDebugInfo;

  constructor(message: string, debug: FetchDebugInfo, cause?: unknown) {
    // TS/JS 런타임 지원 시 cause 붙여줌
    super(message, { cause });
    this.name = 'FetchApiError';
    this.debug = debug;
  }
}
