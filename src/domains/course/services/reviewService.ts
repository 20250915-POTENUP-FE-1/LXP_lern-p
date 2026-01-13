import { deleteApi, getApi, patchApi, postApi } from '@/shared/lib/api/fetchApi';
import {
  CreateReviewRequest,
  CreateReviewResponse,
  DeleteReviewResponse,
  GetAllReviewsResponse,
  GetReviewResponse,
  UpdateReviewRequest,
  UpdateReviewResponse,
} from '../types/review';

//리뷰 생성 API
export const createReview = async (
  courseId: string,
  payload: CreateReviewRequest,
): Promise<CreateReviewResponse> => {
  return await postApi<CreateReviewResponse>(`/api/courses/${courseId}/reviews`, {
    rating: payload.rating,
    content: payload.content?.trim(),
  });
};

//리뷰 수정 API
export const updateReview = async (
  courseId: string,
  payload: UpdateReviewRequest,
): Promise<UpdateReviewResponse> => {
  return await patchApi<UpdateReviewResponse>(`/api/courses/${courseId}/reviews`, {
    rating: payload.rating ?? null,
    content:
      payload.content === undefined
        ? null
        : payload.content === null
          ? null
          : payload.content.trim(),
  });
};

//리뷰 삭제 API
export const deleteReview = async (courseId: string): Promise<DeleteReviewResponse> => {
  return await deleteApi<DeleteReviewResponse>(`/api/courses/${courseId}/reviews`);
};

//강좌 리뷰 조회 API
export const getAllReviews = async (courseId: string): Promise<GetAllReviewsResponse> => {
  return await getApi<GetAllReviewsResponse>(`/api/courses/${courseId}/reviews`);
};

// 리뷰 단건 조회 API
export const getMyReview = async (courseId: string): Promise<GetReviewResponse> => {
  return await getApi<GetReviewResponse>(`/api/courses/${courseId}/review`);
};
