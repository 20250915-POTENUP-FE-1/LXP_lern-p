import type { LearnCourseResponse } from '@/domains/course/types/learn';
import type {
  UpdateProgressResponse,
  UpdateProgressRequest,
  GetProgressResponse,
} from '@/domains/course/types/progress';
import { getApi, patchApi } from '@/shared/lib/api/fetchApi';

// 강좌 정보 조회
export async function getCourse(courseId: string): Promise<LearnCourseResponse> {
  return getApi<LearnCourseResponse>(`/api/courses/${courseId}`, { cache: 'no-store' });
}

// 학습 이력 조회
export async function getLearnProgress(courseId: string): Promise<GetProgressResponse> {
  return getApi<GetProgressResponse>(`/api/progresses/course/${courseId}`, { cache: 'no-store' });
}

// 진도율 갱신
export async function updateLearnProgress(
  courseId: string,
  payload: UpdateProgressRequest,
): Promise<UpdateProgressResponse> {
  return patchApi<UpdateProgressResponse>(`/api/progresses/course/${courseId}`, payload);
}
