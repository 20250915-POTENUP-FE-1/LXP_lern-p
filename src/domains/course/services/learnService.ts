import type {
  LearnCourse,
  LearnEnrollmentResponse,
  LearnProgressResponse,
} from '@/domains/course/types/learn';
import { getApi } from '@/shared/lib/api/fetchApi';

import {
  MOCK_LEARN_COURSE_MAP,
  MOCK_LEARN_ENROLLMENT,
  MOCK_LEARN_PROGRESS,
} from '@/mocks/learn.mock';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'false';

export async function getCourse(courseId: string): Promise<LearnCourse> {
  if (USE_MOCK) {
    const mock = MOCK_LEARN_COURSE_MAP[courseId];
    if (!mock) throw new Error(`Mock course not found: ${courseId}`);
    return mock;
  }

  return getApi<LearnCourse>(`/api/courses/${courseId}`, { cache: 'no-store' });
}

export async function getLearnEnrollment(enrollmentId: string): Promise<LearnEnrollmentResponse> {
  if (USE_MOCK) return MOCK_LEARN_ENROLLMENT;
  return getApi(`/api/enrollments/${enrollmentId}`, { cache: 'no-store' });
}

export async function getLearnProgress(enrollmentId: string): Promise<LearnProgressResponse> {
  if (USE_MOCK) return MOCK_LEARN_PROGRESS;
  return getApi(`/api/progresses/${enrollmentId}`, { cache: 'no-store' });
}
