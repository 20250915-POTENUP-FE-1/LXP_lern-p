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

    const response = await fetch(url, {
      method: options.method || 'GET',
      ...options,
      headers,
    });

    // 응답 데이터 파싱
    const resJson = await response.json();

    // 오류 처리
    if (!response.ok) {
      // 만약 응답이 401 (리프레시 토큰 만료)일 경우 -> 재로그인
      if (response.status === 401) {
        cookieStore.delete('accessToken'); // 제로그인
        cookieStore.delete('refreshToken');
        console.error('리프레시 토큰이 만료되었습니다. 다시 로그인이 필요합니다.');
      }

      throw new Error(`[${response.status} (${resJson.code}) - ${resJson.message}]`);
    }

    // 응답 헤더에 새로운 액세스 토큰이 있다면 쿠키 갱신
    const newAccessToken = response.headers.get('Authorization');
    if (newAccessToken) {
      cookieStore.set('accessToken', newAccessToken, {
        httpOnly: true,
      });
    }

    // 에러 코드 처리
    if (resJson.code.startsWith('E')) {
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
