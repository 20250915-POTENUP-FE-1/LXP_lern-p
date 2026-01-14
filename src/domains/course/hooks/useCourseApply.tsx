import { useEffect, useState } from 'react';
import { User } from '@/domains/user/types/user';
import { getEnrollmentByCourseId } from '@/domains/user/services/enrollmentService';
import { MOCK_ENROLLMENT_LIST } from '@/mocks/enrollmentList.mock';
import { applyCourse } from '../services/courseService';

export function useCourseApply(currentUser: User | null, courseId: string) {
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [applying, setApplying] = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser?.id || !courseId) {
      setIsEnrolled(false);
      return;
    }

    (async () => {
      try {
        // TODO(mock): 개발 중 환경변수로 수강 여부를 mock 데이터로 판단
        const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

        const enrolled = USE_MOCK
          ? MOCK_ENROLLMENT_LIST.content.some(
              (e) => e.courseId === String(courseId) && e.status === 'ENROLLED',
            )
          : Boolean(await getEnrollmentByCourseId(courseId));

        setIsEnrolled(enrolled);
      } catch (err) {
        console.error('수강 상태 확인 실패:', err);
        setIsEnrolled(false);
      }
    })();
  }, [currentUser?.id, courseId]);

  const handleApply = async () => {
    if (!currentUser?.id) {
      throw new Error('로그인이 필요합니다');
    }
    if (!courseId) {
      throw new Error('유효하지 않은 강좌입니다');
    }

    setApplying(true);
    try {
      await applyCourse(currentUser.id, courseId);
      setIsEnrolled(true);
    } catch (error) {
      console.error('수강 신청 실패:', error);
      throw error;
    } finally {
      setApplying(false);
    }
  };

  return { isEnrolled, applying, handleApply };
}
