import { redirect } from 'next/navigation';
import { getEnrollmentByCourseId } from '@/domains/course/services/learnService.server';

import { MOCK_USER } from '@/mocks/user.mock';
import { MOCK_ENROLLMENT_LIST } from '@/mocks/enrollmentList.mock';
import { USE_MOCK } from '@/shared/constants/config';

export type GuardLearnResult = {
  enrollmentId: string;
};

export async function requireLearn(courseId: string): Promise<GuardLearnResult> {
  // TODO(mock): 개발 중 환경변수로 학습 접근 가드를 mock 데이터로 검증
  if (USE_MOCK) {
    const user = MOCK_USER;

    const enrollment = MOCK_ENROLLMENT_LIST.content.find(
      (e) => e.userId === user.id && e.courseId === courseId,
    );

    if (!enrollment) {
      redirect(`/courses/${courseId}`);
    }

    return { enrollmentId: enrollment.enrollmentId };
  }

  const enrollment = await getEnrollmentByCourseId(courseId);

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  return { enrollmentId: enrollment.enrollmentId };
}
