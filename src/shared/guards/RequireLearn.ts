import { redirect } from 'next/navigation';
import { getEnrollmentByCourseId } from '@/domains/course/services/learnService.server';
import type { LearnEnrollmentResponse } from '@/domains/course/types/learn';

import { MOCK_USER } from '@/mocks/user.mock';
import { MOCK_ENROLLMENT_LIST } from '@/mocks/enrollmentList.mock';

export type GuardLearnResult = {
  enrollmentId: string;
};
export async function requireLearn(courseId: string): Promise<GuardLearnResult> {
  const user = MOCK_USER;

  const enrollment = MOCK_ENROLLMENT_LIST.content.find(
    (e) => e.userId === user.userId && e.courseId === courseId,
  );

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  return { enrollmentId: enrollment.enrollmentId };
}
