// src/domains/course/services/courseService.ts

import type { User } from '@/domains/user/types/user';
import type {
  Course,
  Section,
  Lecture,
  CourseDetailResponse,
  SectionDraft,
  CourseDraft,
} from '../types/course';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

// ===== JSON Server용 handleResponse =====
export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const text = await response.text();
  if (!text) return undefined as unknown as T; // DELETE 응답

  return JSON.parse(text) as T;
};

// ===== 1. 발행된 강좌 목록 조회 =====
export const getAllPublishedCourses = async (): Promise<Course[]> => {
  try {
    const res = await fetch(`${API_BASE}/courses?status=published&_sort=createdAt&_order=desc`);
    return await handleResponse<Course[]>(res);
  } catch (err) {
    console.error('[getAllPublishedCourses] 실패:', err);
    throw err;
  }
};

// ===== 2. 강좌 상세 조회 =====
export const getCourse = async (courseId: string): Promise<CourseDetailResponse> => {
  if (!courseId) {
    return { course: null, sections: [], lectures: {} };
  }

  try {
    // 강좌 기본 정보
    const courseRes = await fetch(`${API_BASE}/courses/${courseId}`);
    if (!courseRes.ok) {
      return { course: null, sections: [], lectures: {} };
    }
    const course = await handleResponse<Course>(courseRes);

    // 섹션 목록
    const sectionsRes = await fetch(
      `${API_BASE}/sections?courseId=${courseId}&_sort=sequence&_order=asc`,
    );
    const sections = await handleResponse<Section[]>(sectionsRes);

    // 강의 목록
    const lecturesRes = await fetch(
      `${API_BASE}/lectures?courseId=${courseId}&_sort=sequence&_order=asc`,
    );
    const allLectures = await handleResponse<Lecture[]>(lecturesRes);

    // 섹션별 강의 매핑
    const lectureMap: Record<string, Lecture[]> = {};
    sections.forEach((sec) => {
      lectureMap[sec.id] = allLectures.filter((lec) => lec.sectionId === sec.id);
    });

    return { course, sections, lectures: lectureMap };
  } catch (err) {
    console.error('getCourse 실패:', err);
    throw new Error('강좌 정보를 불러오지 못했습니다.');
  }
};

// ===== 3. 수강 신청 =====
export const applyCourse = async (userId: string, courseId: string): Promise<boolean> => {
  if (!userId || !courseId) throw new Error('Invalid params');

  try {
    // 중복 확인
    const checkRes = await fetch(`${API_BASE}/enrollments?userId=${userId}&courseId=${courseId}`);
    const existing = await handleResponse<any[]>(checkRes);

    if (existing.length > 0) {
      throw new Error('이미 수강 신청한 강좌입니다.');
    }

    // 수강 신청 생성
    await fetch(`${API_BASE}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        courseId,
        progress: 0,
        enrolledAt: new Date().toISOString(),
      }),
    });

    // 강좌 수강생 수 증가
    const courseRes = await fetch(`${API_BASE}/courses/${courseId}`);
    const course = await handleResponse<Course>(courseRes);

    await fetch(`${API_BASE}/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentCount: (course.studentCount || 0) + 1,
        updatedAt: new Date().toISOString(),
      }),
    });

    return true;
  } catch (err) {
    console.error('applyCourse 실패:', err);
    throw err instanceof Error ? err : new Error('수강 신청 중 오류가 발생했습니다.');
  }
};

// ===== 4. 수강 여부 확인 =====
export const getEnrollmentStatus = async (userId: string, courseId: string): Promise<boolean> => {
  if (!userId || !courseId) return false;

  try {
    const res = await fetch(`${API_BASE}/enrollments?userId=${userId}&courseId=${courseId}`);
    const enrollments = await handleResponse<any[]>(res);
    return enrollments.length > 0;
  } catch (err) {
    console.error('getEnrollmentStatus 실패:', err);
    return false;
  }
};

// ===== 10~11. 폼 데이터 조회 =====
