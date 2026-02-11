import { deleteApi, getApi, patchApi, postApi } from '@/shared/lib/api/fetchApi';
import {
  CreateReviewRequest,
  CreateReviewResponse,
  DeleteReviewResponse,
  GetAllReviewsResponse,
  GetIsReviewedRequest,
  GetIsReviewedResponse,
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
  return patchApi<UpdateReviewResponse>(`/api/courses/${courseId}/reviews`, {
    rating: payload.rating,
    content: payload.content.trim(),
  });
};

//리뷰 삭제 API
export const deleteReview = async (courseId: string): Promise<DeleteReviewResponse> => {
  return await deleteApi<DeleteReviewResponse>(`/api/courses/${courseId}/review`);
};

//강좌 리뷰 조회 API
export const getAllReviews = async (courseId: string): Promise<GetAllReviewsResponse> => {
  return await getApi<GetAllReviewsResponse>(`/api/courses/${courseId}/reviews`);
};

// 리뷰 단건 조회 API
export async function getMyReview(courseId: string | number): Promise<GetReviewResponse | null> {
  try {
    return await getApi<GetReviewResponse>(`/api/courses/${courseId}/review`);
  } catch (err) {
    if (err instanceof Error && err.message.includes('ER005')) {
      return null; // 리뷰 없음은 정상 처리
    }
    throw err;
  }
}
// 수강중인 강좌 리뷰 여부 확인 API
export async function getIsReviewed(request: GetIsReviewedRequest): Promise<GetIsReviewedResponse> {
  return postApi<GetIsReviewedResponse>(`/api/reviews/my`, request);
}
