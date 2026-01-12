import type {
  LearnCourseResponse,
  LearnEnrollmentResponse,
  LearnProgressResponse,
  LearnProgressRequest,
} from '@/domains/course/types/learn';
import { getApi, patchApi } from '@/shared/lib/api/fetchApi';

// 강좌 정보 조회
export async function getCourse(courseId: string): Promise<LearnCourseResponse> {
  return getApi<LearnCourseResponse>(`/api/courses/${courseId}`, { cache: 'no-store' });
}

// 수강 정보 조회
export async function getLearnEnrollment(enrollmentId: string): Promise<LearnEnrollmentResponse> {
  return getApi(`/api/enrollments/${enrollmentId}`, { cache: 'no-store' });
}

// 학습 이력 조회
export async function getLearnProgress(enrollmentId: string): Promise<LearnProgressResponse> {
  return getApi(`/api/progresses/${enrollmentId}`, { cache: 'no-store' });
}

// 진도율 갱신
export async function updateLearnProgress(
  payload: LearnProgressRequest,
): Promise<LearnProgressResponse> {
  return patchApi<LearnProgressResponse>(`/api/progresses/${payload.resourceId}`, payload);
}
