import { deleteApi, getApi, patchApi, postApi } from '@/shared/lib/api/fetchApi';
import {
  CreateReviewRequest,
  CreateReviewResponse,
  DeleteReviewResponse,
  GetAllReviewsResponse,
  UpdateReviewRequest,
  UpdateReviewResponse,
} from '../types/review';
import { MOCK_GET_COURSE_REVIEWS } from '@/mocks/review.mock';

//TODO : 리뷰 생성 API
export const createReview = async (
  courseId: string,
  payload: CreateReviewRequest,
): Promise<CreateReviewResponse> => {
  return await postApi<CreateReviewResponse>(`/api/courses/${courseId}/reviews`, {
    rating: payload.rating,
    content: payload.content.trim(),
  });
};

//TODO : 리뷰 수정 API
export const updateReview = async (
  courseId: string,
  reviewId: string | number,
  payload: UpdateReviewRequest,
): Promise<UpdateReviewResponse> => {
  return await patchApi<UpdateReviewResponse>(`/api/courses/${courseId}/reviews/${reviewId}`, {
    rating: payload.rating ?? null,
    content:
      payload.content === undefined
        ? null
        : payload.content === null
          ? null
          : payload.content.trim(),
  });
};

//TODO : 리뷰 삭제 API
export const deleteReview = async (
  courseId: string,
  reviewId: string | number,
): Promise<DeleteReviewResponse> => {
  return await deleteApi<DeleteReviewResponse>(`/api/courses/${courseId}/reviews/${reviewId}`);
};

//TODO : 강좌 리뷰 조회 API
export const getAllReviews = async (courseId: string) => {
  // async (courseId: string): Promise<GetAllReviewsResponse>
  MOCK_GET_COURSE_REVIEWS[courseId] ?? [];
  // return await getApi<GetAllReviewsResponse>(`/api/courses/${courseId}/reviews`);
};
