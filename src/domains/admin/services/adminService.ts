import type { GetAdminCoursesResponse, GetAdminCourseDetailResponse } from '../types';
import type { ApiResponse } from '@/shared/lib/api/fetchApi';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const ADMIN_API_BASE = '/api/admin';

/**
 * 클라이언트용 fetch 함수 (MSW와 호환)
 */
async function clientFetch<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const result: ApiResponse<T> = await response.json();
  return result.data;
}

/**
 * 관리자 대시보드용 강좌 목록 조회
 */
export const getAdminCourses = async (
  page: number = 0,
  size: number = 20
): Promise<GetAdminCoursesResponse> => {
  return clientFetch<GetAdminCoursesResponse>(
    `${ADMIN_API_BASE}/courses?page=${page}&size=${size}`
  );
};

/**
 * 관리자 대시보드용 강좌 상세 조회
 */
export const getAdminCourseDetail = async (
  courseId: string
): Promise<GetAdminCourseDetailResponse> => {
  return clientFetch<GetAdminCourseDetailResponse>(
    `${ADMIN_API_BASE}/courses/${courseId}`
  );
};
