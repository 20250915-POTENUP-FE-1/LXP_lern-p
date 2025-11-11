import { useEffect, useState } from 'react';
import { applyCourse, getEnrollmentStatus } from '../services/courseService';

/**
 * 강좌 수강 신청 관련 훅
 * @param {Object} currentUser - Firebase Auth 사용자 객체
 * @param {string} courseId - 강의 ID
 * @returns {{ isEnrolled: boolean, applying: boolean, handleApply: Function }}
 */
export function useCourseApply(currentUser, courseId) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [applying, setApplying] = useState(false);

  // 수강 여부 확인
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

  // 수강 신청
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
