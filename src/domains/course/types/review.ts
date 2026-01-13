export type ReviewStatus = 'DISPLAY' | 'BLINDED' | 'DELETED' | 'ARCHIVED';

export type Review = {
  id: string;
  courseId: string;
  nickname: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: { nickname: string };
  isMine: boolean;
  status: ReviewStatus;
};

export type CreateReviewRequest = {
  rating?: number | null;
  content?: string | null;
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
  status: 'DISPLAY' | 'BLIND';
  reported: number;
  createdAt: string;
  updatedAt: string;
};

export type GetAllReviewsResponse = GetReviewResponse[];
