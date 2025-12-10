export type EnrollmentStatus = 'ENROLLED' | 'COMPLETED' | 'CANCELED' | 'EXPIRED';

/**
 * Enrollment 도메인 모델
 * 사용자가 강좌를 수강한 기록
 */
export type Enrollment = {
  enrollmentId: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number; // 진도율
  enrolledAt: string; // null 허용 안하는게 도메인적으로 맞음
  updatedAt: string;
};

/**
 * Enrollment + Course Join 모델
 * 마이페이지, 수강 목록 등에 사용
 */
export type EnrollmentWithCourse = Enrollment & {
  course: {
    id: string;
    title: string;
    categories: string[]; // 단일 category는 도메인 상 모순
    thumbnailUrl: string | null;
  };
};
