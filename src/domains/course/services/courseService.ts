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
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase/firestore';
import type { User } from '@/domains/user/types/user';
import { getApi } from '@/shared/lib/api/fetchApi';
import type {
  CreateCourseRequest,
  CreateSectionRequest,
  GetAllCourseResponse,
  GetCourseDetailResponse,
  GetEnrollmentResponse,
} from '../types/course';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * 강좌 목록 조회 (무한 스크롤)
 */
export const getAllCourses = async (): Promise<GetAllCourseResponse> => {
  const response = await fetch(`${BASE_URL}/api/courses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
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
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`강좌 상세 조회 실패: ${response.statusText}`);
  }

  const resJson = await response.json();
  return resJson.data;
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

export const createCourse = async (
  user: User,
  courseData: CreateCourseRequest,
  sectionList: CreateSectionRequest[],
): Promise<string> => {
  if (!user?.id) throw new Error('로그인이 필요합니다.');

  try {
    const courseRef = await addDoc(collection(db, 'courses'), {
      title: courseData.title,
      summary: courseData.summary,
      description: courseData.description,
      thumbnailUrl: courseData.thumbnailUrl,
      instructorId: user.id,
      instructorName: user.nickname,
      category: courseData.category,
      level: courseData.level,
      tags: [courseData.level || '', courseData.category?.[2] || ''],
      price: Number(courseData.price),
      isFree: Number(courseData.price) === 0,
      studentCount: 0,
      duration:
        sectionList.reduce(
          (total, sec) => total + sec.lectures.reduce((sum, lec) => sum + (lec.duration || 0), 0),
          0,
        ) || 0,
      status: 'published',
      sections: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const courseId = courseRef.id;
    const sectionIds: string[] = [];

    for (let i = 0; i < sectionList.length; i++) {
      const sectionData = sectionList[i];
      const sectionRef = await addDoc(collection(db, 'sections'), {
        courseId,
        title: sectionData.title,
        sequence: i + 1,
        lectures: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const sectionId = sectionRef.id;
      sectionIds.push(sectionId);
      const lectureIds: string[] = [];

      for (let j = 0; j < sectionData.lectures.length; j++) {
        const lecData = sectionData.lectures[j];
        const lectureRef = await addDoc(collection(db, 'lectures'), {
          courseId,
          sectionId,
          title: lecData.title,
          videoUrl: lecData.videoUrl || '',
          duration: lecData.duration,
          sequence: j + 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        lectureIds.push(lectureRef.id);
      }

      await updateDoc(sectionRef, { lectures: lectureIds });
    }

    await updateDoc(courseRef, { sections: sectionIds });

    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, {
      createdCourses: arrayUnion(courseId),
      updatedAt: serverTimestamp(),
    });

    return courseId;
  } catch (err) {
    console.error('createCourse 실패:', err);
    throw new Error('강좌 등록 중 오류가 발생했습니다.');
  }
};
