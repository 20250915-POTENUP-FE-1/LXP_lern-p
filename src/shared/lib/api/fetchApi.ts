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
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // 인증 헤더 설정
    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }), // 인증 토큰 포함
      ...options.headers,
    };

    // API 통신
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      ...options,
    });

    // 네트워크 오류 처리
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }

    // 응답 데이터 파싱
    const resJson = await response.json();

    // 응답 헤더에 새로운 액세스 토큰이 있다면 쿠키 갱신
    const newAccessToken = response.headers.get('Authorization');
    if (newAccessToken) {
      cookieStore.set('accessToken', newAccessToken, {
        httpOnly: true,
      });
    }

    // 만약 응답이 401 (액세스 토큰 만료)일 경우
    if (response.status === 401) {
      // 리프레시 토큰이 있을 경우 새로 액세스 토큰을 가져오기 위한 재호출
      if (refreshToken) {
        // 리프레시 토큰을 사용하여 기존의 API 재호출
        const newResponse = await fetch(`${BASE_URL}${endpoint}`, {
          method: options.method || 'GET',
          headers: {
            ...headers,
            Authorization: `Bearer ${refreshToken}`, // 리프레시 토큰을 사용하여 재시도
          },
          body: options.body,
        });
        const newResJson = await newResponse.json();
        return newResJson.data;
      } else {
        throw new Error('리프레시 토큰이 만료되었습니다. 재호출 실패');
      }
    }

    // 에러 코드 처리
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
