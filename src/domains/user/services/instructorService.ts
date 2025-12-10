// src/domains/user/services/instructorService.ts

import type { InstructorCourse } from '@/domains/user/types/instructor';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

// ===== 공통 응답 처리 =====
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const text = await response.text();
  if (!text) return [] as unknown as T;

  return JSON.parse(text) as T;
};

// ===== API 응답 타입 =====
type CourseApiResponse = {
  id: string;
  title: string;
  category: string[];
  thumbnailUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export async function getInstructorCourses(userId: string): Promise<InstructorCourse[]> {
  if (!userId) {
    console.warn('[getInstructorCourses] userId가 없습니다.');
    return [];
  }

  try {
    console.log('=== getInstructorCourses 시작 ===');
    console.log('userId:', userId);

    // instructorId로 강좌 필터링 + 최신순 정렬
    const res = await fetch(
      `${API_BASE}/courses?instructorId=${encodeURIComponent(userId)}&_sort=createdAt&_order=desc`,
    );

    const courses = await handleResponse<CourseApiResponse[]>(res);

    const result: InstructorCourse[] = courses.map((course) => ({
      id: course.id,
      title: course.title ?? '제목 없음',
      category: course.category ?? null,
      thumbnailUrl: course.thumbnailUrl ?? null,
      createdAt: course.createdAt ?? null,
      updatedAt: course.updatedAt ?? null,
    }));

    console.log('=== getInstructorCourses 완료 ===');

    return result;
  } catch (err) {
    console.error('[getInstructorCourses] 실패:', err);
    throw new Error('강사 강좌 목록을 불러오지 못했습니다.');
  }
}
