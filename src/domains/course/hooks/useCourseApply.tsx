import { useEffect, useState } from 'react';
import { applyCourse, getEnrollmentStatus } from '../services/courseService';
import { User } from '@/domains/user/types/user';

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
        const enrolled = await getEnrollmentStatus(currentUser.id, courseId);
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
