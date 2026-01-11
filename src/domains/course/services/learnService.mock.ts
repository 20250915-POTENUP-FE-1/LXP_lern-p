import { MOCK_LEARN_COURSE_MAP } from '@/mocks/learn.mock';

export async function getLearnCourse(courseId: string) {
  return MOCK_LEARN_COURSE_MAP[courseId];
}
