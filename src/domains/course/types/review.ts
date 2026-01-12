export type ReviewStatus = 'DISPLAY' | 'BLINDED' | 'DELETED' | 'ARCHIVED';

export type Review = {
  id: string;
  courseId: string;
  rating: number; // 1 ~ 5
  content: string;
  createdAt: string;
  updatedAt: string;
  user: { nickname: string };
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

export type GetAllReviewsItem = {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  content: string;
  status: 'DISPLAY' | 'BLIND';
  reported: number;
  createdAt: string;
  updatedAt: string;
};

export type GetAllReviewsResponse = GetAllReviewsItem[];
