import type {
  LearnCourseResponse,
  LearnEnrollmentResponse,
  LearnProgressResponse,
} from '@/domains/course/types/learn';
import { getApi } from '@/shared/lib/api/fetchApi';

/**
 * 강좌 상세 조회
 */
export async function getCourse(courseId: string): Promise<LearnCourseResponse> {
  return getApi<LearnCourseResponse>(`/api/courses/${courseId}`, { cache: 'no-store' });
}

/**
 * 수강 정보 조회 (단건)
 */
export async function getLearnEnrollment(enrollmentId: string): Promise<LearnEnrollmentResponse> {
  return getApi(`/api/enrollments/${enrollmentId}`, { cache: 'no-store' });
}

/**
 * 학습 진척도 조회
 */
export async function getLearnProgress(enrollmentId: string): Promise<LearnProgressResponse> {
  return getApi(`/api/progresses/${enrollmentId}`, { cache: 'no-store' });
}
