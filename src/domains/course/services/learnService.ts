import { MOCK_LEARN_PAGE_DATA } from '@/domains/course/mocks/learn.mock';
import type {
  LearnCourse,
  LearnPageData,
  CourseDetailResponse,
  EnrollmentListResponse,
  ProgressResponse,
} from '@/domains/course/types/learn';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

async function fetchCourse(courseId: string): Promise<LearnCourse> {
  const res = await fetch(`${API_BASE}/api/courses/${courseId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('강좌 조회에 실패했습니다.');
  }

  const json: CourseDetailResponse = await res.json();
  return json.data;
}

async function fetchEnrollmentByCourseId(
  courseId: number,
): Promise<(LearnPageData['enrollment'] & { enrollmentId: number }) | null> {
  const res = await fetch(`${API_BASE}/api/enrollments?status=ENROLLED&page=1&size=50`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const json: EnrollmentListResponse = await res.json();
  const matched = json.data.content.find((item) => item.courseId === courseId);

  return matched ?? null;
}

async function fetchProgressByEnrollmentId(
  enrollmentId: number,
): Promise<LearnPageData['progress'] | null> {
  const res = await fetch(`${API_BASE}/api/progresses/${enrollmentId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const json: ProgressResponse = await res.json();
  return json.data;
}

export async function getLearnPageData(courseIdParam: string): Promise<LearnPageData> {
  // 더미 모드일 경우
  if (USE_MOCK) {
    return MOCK_LEARN_PAGE_DATA;
  }

  const courseId = Number(courseIdParam);

  const [course, enrollmentWithId] = await Promise.all([
    fetchCourse(courseIdParam),
    fetchEnrollmentByCourseId(courseId),
  ]);

  const progress = enrollmentWithId
    ? await fetchProgressByEnrollmentId(enrollmentWithId.enrollmentId)
    : null;

  const { enrollmentId: _enrollmentId, ...enrollment } = enrollmentWithId ?? {};

  return {
    course,
    enrollment: enrollmentWithId ? (enrollment as LearnPageData['enrollment']) : null,
    progress,
  };
}
