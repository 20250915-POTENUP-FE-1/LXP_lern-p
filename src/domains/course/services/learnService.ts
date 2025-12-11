import type {
  LearnCourse,
  LearnEnrollmentResponse,
  LearnProgressResponse,
} from '@/domains/course/types/learn';
import { getApi } from '@/shared/lib/api/fetchApi';

/**
 * 강좌 상세 조회
 */
export async function getCourse(courseId: string): Promise<LearnCourse> {
  return await getApi<LearnCourse>(`/api/courses/${courseId}`, {
    cache: 'no-store',
  });
}

/**
 * 수강 정보 조회 (단건)
 */
export async function getEnrollment(enrollmentId: string): Promise<LearnEnrollmentResponse> {
  return await getApi<LearnEnrollmentResponse>(`/api/enrollments/${enrollmentId}`, {
    cache: 'no-store',
  });
}

/**
 * 학습 진척도 조회
 */
export async function getProgress(enrollmentId: string): Promise<LearnProgressResponse> {
  return await getApi<LearnProgressResponse>(`/api/progresses/${enrollmentId}`, {
    cache: 'no-store',
  });
}
