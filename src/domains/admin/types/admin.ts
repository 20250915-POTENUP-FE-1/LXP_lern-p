// 관리자 대시보드 관련 타입 정의

// AI 리뷰 요약 타입
export type ReviewSentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export type AIReviewSummary = {
  sentiment: ReviewSentiment;
  positive: string;
  negative: string;
  suggestion: string;
};

// 별점 분포 타입
export type RatingDistribution = {
  rating: number; // 1-5
  count: number;
  percentage: number;
};

// 관리자 대시보드용 강좌 타입
export type AdminCourseItem = {
  courseId: string;
  title: string;
  instructorName: string;
  categories: string[];
  rating: number;
  studentCount: number;
  reviewCount: number;
  aiSummary: AIReviewSummary;
  needsAttention: boolean; // 주의 필요 여부
};

// 강좌 상세 정보 (모달용)
export type AdminCourseDetail = {
  courseId: string;
  title: string;
  instructorName: string;
  categories: string[];
  rating: number;
  studentCount: number;
  reviewCount: number;
  aiSummary: AIReviewSummary;
  ratingDistribution: RatingDistribution[];
  needsAttention: boolean;
};

// 대시보드 통계 타입
export type DashboardStats = {
  totalCourses: number;
  averageRating: number;
  totalStudents: number;
  needsAttentionCount: number;
};

// 대시보드 API 응답 타입
export type GetAdminCoursesResponse = {
  content: AdminCourseItem[];
  stats: DashboardStats;
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

// 강좌 상세 API 응답 타입
export type GetAdminCourseDetailResponse = AdminCourseDetail;

// 필터 타입
export type CourseFilter = 'all' | 'needs_attention';
