export type EnrollmentStatus = 'ENROLLED' | 'COMPLETED' | 'CANCELED' | 'EXPIRED';

// 1) 수강 목록 조회 (GET /api/enrollments)
export type EnrollmentListItem = {
  enrollmentId: string;
  courseId: string;
  courseName: string;
  status: EnrollmentStatus;
  progressRate: number;
  expiredAt: string;
  categories: string[];
};

export type EnrollmentListPage = {
  content: EnrollmentListItem[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};

// 2) 수강 단건 조회 (GET /api/enrollments/{enrollmentId})
export type EnrollmentDetail = {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  progressRate: number;
  createdAt: string;
  expiredAt: string;
};

// 3) 진도 조회 (GET /api/progresses/{enrollmentId})
export type EnrollmentProgress = {
  resourceId: string;
  enrollmentId: string;
  progressRate: number;
  lastVideoId: string;
  lastWatchedDuration: number;
  updatedAt: string;
};

// 4) Learn 페이지 전용 묶음 타입
export type EnrollmentLearnData = {
  enrollment: EnrollmentDetail | null;
  progress: EnrollmentProgress | null;
};
