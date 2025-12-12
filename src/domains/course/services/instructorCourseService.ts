import { getApi } from '@/shared/lib/api/fetchApi';
import type { InstructorCoursePage } from '@/domains/course/types/instructor';

/**
 * 내가 등록한 강좌 목록 조회
 */
export async function getInstructorCourses(): Promise<InstructorCoursePage> {
  return getApi<InstructorCoursePage>('/api/instructor/courses', {
    cache: 'no-store',
  });
}
