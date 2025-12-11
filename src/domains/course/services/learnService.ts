import type {
  LearnCourse,
  LearnEnrollmentResponse,
  LearnProgressResponse,
} from '@/domains/course/types/learn';
import { getApi } from '@/shared/lib/api/fetchApi';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';

export async function getCourse(courseId: number): Promise<LearnCourse> {
  return getApi<LearnCourse>(`${BASE_URL}/api/courses/${courseId}`, {
    cache: 'no-store',
  });
}

export async function getEnrollment(enrollmentId: number): Promise<LearnEnrollmentResponse | null> {
  const res = await getApi<LearnEnrollmentResponse>(`${BASE_URL}/api/enrollments/${enrollmentId}`, {
    cache: 'no-store',
  });

  return res ?? null;
}

export async function getProgress(enrollmentId: number): Promise<LearnProgressResponse | null> {
  const res = await getApi<LearnProgressResponse>(`${BASE_URL}/api/progresses/${enrollmentId}`, {
    cache: 'no-store',
  });

  return res ?? null;
}
