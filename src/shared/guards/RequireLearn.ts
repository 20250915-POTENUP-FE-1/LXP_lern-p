import { redirect } from 'next/navigation';
import { getEnrollmentByCourseId } from '@/domains/course/services/learnService.server';
import type { LearnEnrollmentResponse } from '@/domains/course/types/learn';

// TODO: 임시 목업 데이터
import { MOCK_USER } from '@/mocks/user.mock';
import { MOCK_ENROLLMENT_LIST } from '@/mocks/enrollmentList.mock';

// TODO: 임시 목업 데이터
export type GuardLearnResult = {
  enrollmentId: string;
};

export async function requireLearn(courseId: string): Promise<GuardLearnResult> {
  // <LearnEnrollmentResponse>
  // TODO: 임시 목업 데이터
  const user = MOCK_USER;

  // TODO: 임시 목업 데이터
  // const enrollment = await getEnrollmentByCourseId(courseId);
  const enrollment = MOCK_ENROLLMENT_LIST.content.find(
    (e) => e.userId === user.id && e.courseId === courseId,
  );

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  return { enrollmentId: enrollment.enrollmentId };
}
