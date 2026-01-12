import type { Review } from '@/domains/course/types/course';
import { MOCK_REVIEWS_BY_COURSE } from '@/mocks/review';

// 나중에 API 생기면 여기 구현
async function getCourseReviewsFromApi(courseId: string): Promise<Review[]> {
  // TODO: return await getApi<Review[]>(`/api/courses/${courseId}/reviews`);
  return [];
}

export async function getCourseReviews(courseId: string): Promise<Review[]> {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    return MOCK_REVIEWS_BY_COURSE[courseId] ?? [];
  }

  return await getCourseReviewsFromApi(courseId);
}
