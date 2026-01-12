// 리뷰 관련 타입
export type ReviewStatus = 'DISPLAY' | 'BLINDED' | 'DELETED' | 'ARCHIVED';

export type Review = {
  id: string;
  courseId: string;
  rating: number; // 1 ~ 5
  content: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  user: {
    nickname: string;
  };
  isMine: boolean;
  status: ReviewStatus;
};

export type GetCourseReviewResponse = Review; // TODO: API 명세 확정 후, 수정
