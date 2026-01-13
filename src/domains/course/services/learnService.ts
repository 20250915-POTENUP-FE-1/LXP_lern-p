import type { LearnCourseResponse, LearnEnrollmentResponse } from '@/domains/course/types/learn';
import type {
  GetLearnLectureProgressResponse,
  UpdateLearnProgressRequest,
} from '@/domains/course/types/progress';
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
export async function getLearnProgress(
  enrollmentId: string,
): Promise<GetLearnLectureProgressResponse> {
  return getApi(`/api/progresses/${enrollmentId}`, { cache: 'no-store' });
}

// 진도율 갱신
export async function updateLearnProgress(
  payload: UpdateLearnProgressRequest,
): Promise<GetLearnLectureProgressResponse> {
  return patchApi<GetLearnLectureProgressResponse>(
    `/api/progresses/${payload.resourceId}`,
    payload,
  );
}
