import { getApi } from '@/shared/lib/api/fetchApi';
import type { GetAdminCoursesResponse, GetAdminCourseDetailResponse } from '../types';

const ADMIN_API_BASE = '/admin';

/**
 * 관리자 대시보드용 강좌 목록 조회
 */
export const getAdminCourses = async (
  page: number = 0,
  size: number = 20
): Promise<GetAdminCoursesResponse> => {
  const response = await getApi<GetAdminCoursesResponse>(
    `${ADMIN_API_BASE}/courses?page=${page}&size=${size}`
  );
  return response;
};

/**
 * 관리자 대시보드용 강좌 상세 조회
 */
export const getAdminCourseDetail = async (
  courseId: string
): Promise<GetAdminCourseDetailResponse> => {
  const response = await getApi<GetAdminCourseDetailResponse>(
    `${ADMIN_API_BASE}/courses/${courseId}`
  );
  return response;
};
