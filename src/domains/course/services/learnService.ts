import type {
  LearnCourse,
  LearnEnrollmentResponse,
  LearnProgressResponse,
} from '@/domains/course/types/learn';
import { getApi } from '@/shared/lib/api/fetchApi';

export async function getCourse(courseId: string): Promise<LearnCourse> {
  return getApi<LearnCourse>(`/api/courses/${courseId}`, { cache: 'no-store' });
}

export async function getLearnEnrollment(enrollmentId: string): Promise<LearnEnrollmentResponse> {
  return getApi(`/api/enrollments/${enrollmentId}`, { cache: 'no-store' });
}

export async function getLearnProgress(enrollmentId: string): Promise<LearnProgressResponse> {
  return getApi(`/api/progresses/${enrollmentId}`, { cache: 'no-store' });
}
