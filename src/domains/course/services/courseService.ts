import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  increment,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase/firestore';
import type {
  GetAllCoursesParams,
  GetAllCourseResponse,
  GetCourseDetailResponse,
} from '@/domains/course/types/course';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * 강좌 목록 조회 (무한 스크롤)
 */
export const getAllCourses = async (
  params?: GetAllCoursesParams,
): Promise<GetAllCourseResponse> => {
  const query = new URLSearchParams();
  if (params?.page != null) query.set('page', String(params.page));
  if (params?.size != null) query.set('size', String(params.size));
  if (params?.categoryId != null) query.set('categoryId', String(params.categoryId));
  if (params?.level) query.set('level', params.level);
  if (params?.keyword) query.set('keyword', params.keyword);
  // if (params?.sort) query.set('sort', params.sort);

  const response = await fetch(`${BASE_URL}/api/courses?${query.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`강좌 목록 조회 실패: ${response.statusText}`);
  }
  const resJson = await response.json();

  return resJson.data;
};

/**
 * 강좌 상세 조회
 */
export const getCourseDetail = async (courseId: string): Promise<GetCourseDetailResponse> => {
  const response = await fetch(`${BASE_URL}/api/courses/${courseId}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`강좌 상세 조회 실패: ${response.statusText}`);
  }
  const resJson = await response.json();

  return resJson.data;
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
