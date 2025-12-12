import { getApi } from '@/shared/lib/api/fetchApi';
import type { InstructorCourseListResponse } from '@/domains/course/types/instructor';

/**
 * 내가 등록한 강좌 목록 조회
 */
export async function getInstructorCourses(): Promise<InstructorCourseListResponse> {
  return getApi<InstructorCourseListResponse>('/api/instructor/courses', {
    cache: 'no-store',
  });
}
