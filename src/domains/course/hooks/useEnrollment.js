// src/domains/course/hooks/useEnrollment.js
import { db } from '@/shared/lib/firebase/firestore';
import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

/**
 * 수강 신청 관련 로직 커스텀 훅
 * @param {Object} currentUser - Firebase Auth 사용자 객체
 * @param {string} courseId - 강의 ID
 * @returns {Object} { isEnrolled, enrolling, handleEnroll }
 */

// export 키워드 반드시 필요!
export function useEnrollment(currentUser, courseId) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!currentUser || !courseId) {
        setIsEnrolled(false);
        return;
      }

      try {
        const userDocSnap = await getDoc(doc(db, 'users', currentUser.uid));

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();

          const enrollmentId = `u_${currentUser.uid}_c_${courseId}`;
          const enrolled = userData.enrolledCourseIds?.includes(enrollmentId);
          setIsEnrolled(enrolled || false);
        } else {
          setIsEnrolled(false);
        }
      } catch (error) {
        console.error('수강 상태 확인 실패:', error);
        setIsEnrolled(false);
      }
    };

    checkEnrollmentStatus();
  }, [currentUser, courseId]);

  const handleEnroll = async () => {
    if (!currentUser) {
      throw new Error('로그인이 필요합니다');
    }

    setEnrolling(true);
    try {
      const userId = currentUser.uid;
      const enrollmentId = `u_${userId}_c_${courseId}`; // enrollment ID 생성
      const now = new Date().toISOString();

      //enrollments 컬렉션에 문서 생성
      const enrollmentRef = doc(db, 'enrollments', enrollmentId);
      await setDoc(enrollmentRef, {
        id: enrollmentId,
        userId: userId,
        courseId: courseId,
        progress: 0,
        enrolledAt: now,
        updatedAt: now,
      });
      console.log('enrollments 컬렉션에 문서 생성 완료');

      // users 컬렉션에 enrollment ID만 추가
      const userRef = doc(db, 'users', currentUser.uid);

      //Firestore에 데이터를 추가하는 코드
      await updateDoc(userRef, {
        enrolledCourseIds: arrayUnion(enrollmentId), //id만 저장
        updatedAt: serverTimestamp(),
      });

      //course 콜렉션에 studentcount 추가
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, {
        studentCount: increment(1),
        updatedAt: serverTimestamp(),
      });

      setIsEnrolled(true);
    } catch (error) {
      console.error('수강 신청 실패:', error);
      throw error;
    } finally {
      setEnrolling(false);
    }
  };

  return { isEnrolled, enrolling, handleEnroll };
}
