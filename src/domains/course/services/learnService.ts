import type {
  LearnCourse,
  LearnEnrollmentResponse,
  LearnProgressResponse,
} from '@/domains/course/types/learn';
import { getApi } from '@/shared/lib/api/fetchApi';

export async function getCourse(courseId: number): Promise<LearnCourse> {
  return await getApi<LearnCourse>(`/api/courses/${courseId}`, {
    cache: 'no-store',
  });
}

export async function getEnrollment(enrollmentId: number): Promise<LearnEnrollmentResponse> {
  return await getApi<LearnEnrollmentResponse>(`/api/enrollments/${enrollmentId}`, {
    cache: 'no-store',
  });
}

export async function getProgress(enrollmentId: number): Promise<LearnProgressResponse> {
  return await getApi<LearnProgressResponse>(`/api/progresses/${enrollmentId}`, {
    cache: 'no-store',
  });
}
