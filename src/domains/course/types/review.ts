export type ReviewStatus = 'DISPLAY' | 'BLINDED' | 'DELETED' | 'ARCHIVED';

export type Review = {
  id: string;
  courseId: string;
  nickname: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isMine: boolean;
  status: ReviewStatus;
};

export type CreateReviewRequest = {
  rating: number;
  content: string;
};

export type UpdateReviewRequest = {
  rating: number;
  content: string;
};

export type CreateReviewResponse = {
  reviewId: string;
};

export type UpdateReviewResponse = {
  reviewId: string;
};

export type DeleteReviewResponse = object;

export type GetReviewResponse = {
  id: string;
  userId: string;
  nickname: string;
  courseId: string;
  rating: number;
  content: string;
  status: ReviewStatus;
  reported: number;
  createdAt: string;
  updatedAt: string;
  isMine: boolean;
};

export type GetAllReviewsResponse = GetReviewResponse[];

export type GetIsReviewedRequest = {
  courseIds: number[];
};

export type GetIsReviewedResponseItem = {
  courseId: number;
  isReviewed: boolean;
};

export type GetIsReviewedResponse = GetIsReviewedResponseItem[];
