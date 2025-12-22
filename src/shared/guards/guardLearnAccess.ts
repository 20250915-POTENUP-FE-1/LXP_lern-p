import { redirect } from 'next/navigation';
import { getEnrollmentByCourseId } from '@/domains/course/services/learnService.server';
import type { LearnEnrollmentResponse } from '@/domains/course/types/learn';

export async function guardLearnAccess(courseId: string): Promise<LearnEnrollmentResponse> {
  const enrollment = await getEnrollmentByCourseId(courseId);

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  return enrollment;
}
