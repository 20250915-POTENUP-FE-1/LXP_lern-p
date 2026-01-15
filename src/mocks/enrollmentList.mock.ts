import type { EnrollmentListResponse } from '@/domains/user/types/enrollment';

export const MOCK_ENROLLMENT_LIST: EnrollmentListResponse = {
  content: [
    {
      userId: 'user_001',
      enrollmentId: '5002',
      courseId: '2002',
      courseName: '스프링 부트 완벽 가이드2',
      status: 'ENROLLED',
      progressRate: 45,
      expiredAt: '2026-01-01T09:00:00',
      categories: ['백엔드', 'Spring'],
    },
    {
      userId: 'user_001',
      enrollmentId: '5004',
      courseId: '2004',
      courseName: '데이터베이스 기초',
      status: 'ENROLLED',
      progressRate: 20,
      expiredAt: '2026-03-10T09:00:00',
      categories: ['데이터베이스'],
    },
  ],
  totalElements: 4,
  totalPages: 1,
  pageNumber: 0,
  pageSize: 30,
};
