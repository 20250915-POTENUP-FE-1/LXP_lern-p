import { getApi } from '@/shared/lib/api/fetchApi';
import type { InstructorCoursePage } from '@/domains/course/types/instructor';

import { MOCK_INSTRUCTOR_COURSES } from '@/mocks/instructorCourse.mock';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * 내가 등록한 강좌 목록 조회
 * GET /api/instructor/courses
 */
export async function getInstructorCourses(): Promise<InstructorCoursePage> {
  if (USE_MOCK) return MOCK_INSTRUCTOR_COURSES;

  return getApi<InstructorCoursePage>('/api/instructor/courses', {
    cache: 'no-store',
  });
}
