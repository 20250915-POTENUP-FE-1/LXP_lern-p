import type { GetCourseReviewResponse, Review } from '@/domains/course/types/review';
import { MOCK_GET_COURSE_REVIEWS } from '@/mocks/review.mock';

// TODO: 나중에 API 생기면 여기 구현
export async function getCourseReviews(courseId: string): Promise<GetCourseReviewResponse[]> {
  // TODO: return await getApi<Review[]>(`/api/courses/${courseId}/reviews`);
  return [];
}
