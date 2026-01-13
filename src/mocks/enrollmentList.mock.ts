import type { EnrollmentListResponse } from '@/domains/user/types/enrollment';

export const MOCK_ENROLLMENT_LIST: EnrollmentListResponse = {
  content: [
    {
      enrollmentId: '5001',
      userId: 'user_001',
      courseId: '2002',
      courseName: '스프링 부트 완벽 가이드',
      status: 'ENROLLED',
      progressRate: 5,
      categories: ['백엔드'],
      expiredAt: '2026-01-01T09:00:00',
    },
  ],
  totalElements: 3,
  totalPages: 1,
  pageNumber: 0,
  pageSize: 30,
};
