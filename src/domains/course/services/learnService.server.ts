import { getApi } from '@/shared/lib/api/fetchApi';
import type { LearnEnrollmentResponse } from '@/domains/course/types/learn';

export async function getEnrollmentByCourseId(
  courseId: string,
): Promise<LearnEnrollmentResponse | null> {
  try {
    return await getApi<LearnEnrollmentResponse>(`/api/enrollments/course/${courseId}`, {
      cache: 'no-store',
    });
  } catch {
    return null;
  }
}
