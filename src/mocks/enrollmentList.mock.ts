import type { EnrollmentListResponse } from '@/domains/user/types/enrollment';
import type { GetEnrollmentResponse } from '@/domains/course/types/course';

export const MOCK_ENROLLMENT_LIST: EnrollmentListResponse = {
  content: [
    {
      enrollmentId: '5002',
      courseId: '2002',
      courseName: '스프링 부트 완벽 가이드',
      status: 'ENROLLED',
      progressRate: 45,
      expiredAt: '2026-01-01T09:00:00',
      categories: ['백엔드', 'Spring'],
    },
  ],
  totalElements: 1,
  totalPages: 1,
  pageNumber: 0,
  pageSize: 30,
};

export const MOCK_GET_ENROLLMENT_BY_COURSEID: GetEnrollmentResponse = {
  enrollmentId: '5002',
  courseId: '2002',
  studentId: 'user_001',
  status: 'ENROLLED',
  progressRate: 45,
  createdAt: '2025-12-02T09:00:00',
  expiredAt: '2026-01-01T09:00:00',
};
