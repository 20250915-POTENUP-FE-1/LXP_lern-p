import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  increment,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase/firestore';
import { getApi } from '@/shared/lib/api/fetchApi';
import type {
  GetAllCourseResponse,
  GetCourseDetailResponse,
  GetEnrollmentResponse,
} from '../types/course';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import { MOCK_GET_ALL_COURSE, MOCK_GET_COURSE_DETAIL } from '@/mocks/course.mock';

/**
 * 강좌 목록 조회 (무한 스크롤)
 */
export const getAllCourses = async (): Promise<GetAllCourseResponse> => {
  return MOCK_GET_ALL_COURSE;

  // const response = await fetch(`${BASE_URL}/api/courses`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });
  // if (!response.ok) {
  //   throw new Error(`강좌 목록 조회 실패: ${response.statusText}`);
  // }
  // const resJson = await response.json();

  //return resJson.data;
};
/**
 * 강좌 상세 조회
 */
export const getCourseDetail = async (courseId: string): Promise<GetCourseDetailResponse> => {
  return MOCK_GET_COURSE_DETAIL;

  // const response = await fetch(`${BASE_URL}/api/courses/${courseId}`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });
  // if (!response.ok) {
  //   throw new Error(`강좌 상세 조회 실패: ${response.statusText}`);
  // }
  // const resJson = await response.json();

  // return resJson.data;
};
/**
 * 강좌 별 수강 정보 조회
 */
export const getEnrollmentByCourseId = async (
  courseId: string,
): Promise<GetEnrollmentResponse | null> => {
  try {
    return await getApi<GetEnrollmentResponse | null>(`/api/enrollments/course/${courseId}`, {
      cache: 'no-store',
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('[404 (EE004)')) {
      return null;
    }
    throw err;
  }
};
/**
 * 강좌 신청
 */
export const applyCourse = async (userId: string, courseId: string): Promise<boolean> => {
  if (!userId || !courseId) throw new Error('Invalid params');
  try {
    const now = new Date().toISOString();
    await runTransaction(db, async (tx) => {
      const enrollmentRef = await addDoc(collection(db, 'enrollments'), {
        userId,
        courseId,
        progress: 0,
        enrolledAt: now,
        updatedAt: now,
      });
      const userRef = doc(db, 'users', userId);
      tx.update(userRef, {
        enrolledCourses: arrayUnion(enrollmentRef.id),
        updatedAt: serverTimestamp(),
      });
      const courseRef = doc(db, 'courses', courseId);
      tx.update(courseRef, {
        studentCount: increment(1),
        updatedAt: serverTimestamp(),
      });
    });
    return true;
  } catch (err) {
    console.error('applyCourse 실패:', err);
    throw new Error('수강 신청 중 오류가 발생했습니다.');
  }
};
export const getEnrollmentStatus = async (userId: string, courseId: string): Promise<boolean> => {
  if (!userId || !courseId) return false;
  try {
    const q = query(
      collection(db, 'enrollments'),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (err) {
    console.error('getEnrollmentStatus 실패:', err);
    return false;
  }
};
