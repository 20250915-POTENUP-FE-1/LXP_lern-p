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
export async function fetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    if (!BASE_URL) throw new Error('NEXT_PUBLIC_BASE_URL 누락');

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

    const headers: Record<string, string> = {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...((options.headers as Record<string, string> | undefined) ?? {}),
    };

    // JSON 요청일 때만 Content-Type 기본 부여
    if (!isFormData) {
      const hasContentType = Object.keys(headers).some((k) => k.toLowerCase() === 'content-type');
      if (!hasContentType) headers['Content-Type'] = 'application/json';
    } else {
      // FormData면 Content-Type을 절대 직접 넣지 않음 (boundary 자동 설정 필요)
      for (const k of Object.keys(headers)) {
        if (k.toLowerCase() === 'content-type') delete headers[k];
      }
    }
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: options.method || 'GET',
      ...options,
      headers,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`,
      );
    }

    const resJson = (await response.json()) as ApiResponse<T>;

    const newAccessToken = response.headers.get('Authorization');
    if (newAccessToken) {
      cookieStore.set('accessToken', newAccessToken, { httpOnly: true });
    }

    if (resJson.code?.startsWith('E')) {
      throw new Error(resJson.message);
    }

    return resJson.data as T;
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('알 수 없는 오류가 발생했습니다.');
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
