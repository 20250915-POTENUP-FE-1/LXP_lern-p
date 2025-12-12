import type { EnrollmentListResponse } from '@/domains/user/types/enrollment';

export const MOCK_ENROLLMENT_LIST: EnrollmentListResponse = {
  content: [
    {
      enrollmentId: '5001',
      courseId: '2001',
      courseName: 'Spring Boot 완벽 가이드',
      status: 'ENROLLED',
      progressRate: 45,
      expiredAt: '2026-01-01T09:00:00',
      categories: ['백엔드', 'Spring'],
    },
    {
      enrollmentId: '5002',
      courseId: '2002',
      courseName: 'React & Next.js 완전 정복',
      status: 'ENROLLED',
      progressRate: 70,
      expiredAt: '2025-12-31T09:00:00',
      categories: ['프론트엔드', 'React'],
    },
    {
      enrollmentId: '5003',
      courseId: '2003',
      courseName: '데이터베이스 기초',
      status: 'ENROLLED',
      progressRate: 20,
      expiredAt: '2026-03-10T09:00:00',
      categories: ['데이터베이스'],
    },
  ],
  totalElements: 3,
  totalPages: 1,
  pageNumber: 0,
  pageSize: 30,
};
