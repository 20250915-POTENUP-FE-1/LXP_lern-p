export type EnrollmentStatus = 'ENROLLED' | 'COMPLETED' | 'CANCELED' | 'EXPIRED';

// 1) 수강 목록 조회 (GET /api/enrollments)
export type EnrollmentListContent = {
  enrollmentId: string;
  courseId: string;
  courseName: string;
  status: EnrollmentStatus;
  // TODO: 백엔드 전환 완료 후 progressRate 제거하고 overallProgressRate로 통합
  progressRate?: number;
  overallProgressRate?: number;
  expiredAt: string;
  categories: string[];
  isReviewed?: boolean; // TODO: 추후에 변경 가능성
};

export type EnrollmentListResponse = {
  content: EnrollmentListContent[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};

export type GetEnrollmentResponse = {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  // TODO: 백엔드 전환 완료 후 progressRate 제거하고 overallProgressRate로 통합
  progressRate?: number;
  overallProgressRate?: number;
  createdAt: string;
  expiredAt: string;
};

export type EnrollmentDetail = GetEnrollmentResponse;

// 4) Learn 페이지 전용 묶음 타입
export type EnrollmentLearnData = {
  enrollment: EnrollmentDetail | null;
};
