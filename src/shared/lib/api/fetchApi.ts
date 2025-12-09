import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    // 쿠키에서 accessToken 꺼내기
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    // 인증 헤더 설정
    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }), // 인증 토큰 포함
      ...options.headers,
    };

    // API 통신
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    // 네트워크 오류 처리
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }

    // 응답 데이터 파싱
    const resJson = await response.json();

    // API에서 반환한 커스텀코드 확인
    if (resJson.code.startsWith('E')) {
      throw new Error(resJson.message);
    }

    return resJson.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      // 네트워크 오류 또는 기타 API 오류 메시지 처리
      throw new Error(error.message);
    }
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
export async function postApi<T = unknown>(endpoint: string, data: unknown): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT 요청을 위한 fetchApi wrapper
 *
 * @param endpoint API 엔드포인트
 * @param data 요청 데이터
 */
export async function putApi<T = unknown>(endpoint: string, data: unknown): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE 요청을 위한 fetchApi wrapper
 *
 * @param endpoint API 엔드포인트
 */
export async function deleteApi<T = unknown>(endpoint: string): Promise<T> {
  return fetchApi<T>(endpoint, { method: 'DELETE' });
}

/**
 * PATCH 요청을 위한 fetchApi wrapper
 *
 * @param endpoint API 엔드포인트
 * @param data 요청 데이터
 */
export async function patchApi<T = unknown>(endpoint: string, data: unknown): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
