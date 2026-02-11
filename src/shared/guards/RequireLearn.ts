import { redirect } from 'next/navigation';
import { USE_MOCK } from '@/shared/constants/config';
import { getEnrollmentByCourseId } from '@/domains/user/services/enrollmentService';
import { MOCK_GET_ENROLLMENT_BY_COURSEID } from '@/mocks/enrollmentList.mock';

export async function requireLearn(courseId: string) {
  // TODO(mock): 개발 중 환경변수로 학습 접근 가드를 mock 데이터로 검증
  const enrollment = USE_MOCK
    ? Number(MOCK_GET_ENROLLMENT_BY_COURSEID.courseId) === Number(courseId)
      ? MOCK_GET_ENROLLMENT_BY_COURSEID
      : null
    : await getEnrollmentByCourseId(courseId);

  if (!enrollment || Number(enrollment.courseId) !== Number(courseId)) {
    redirect(`/courses/${courseId}`);
  }

  if (enrollment.status === 'CANCELED' || enrollment.status === 'EXPIRED') {
    redirect(`/courses/${courseId}?error=not-available`);
  }

  return { enrollment };
}
