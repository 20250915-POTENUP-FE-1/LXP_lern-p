import type { EnrollmentListResponse } from '@/domains/user/types/enrollment';
import { mockLearnProgress } from './learn.mock';

export const MOCK_ENROLLMENT_LIST: EnrollmentListResponse = {
  content: [
    {
      enrollmentId: 'mock-enrollment-1',
      userId: 'u-001',
      courseId: '2001',
      courseName: '스프링 부트 완벽 가이드',
      status: 'ENROLLED',
      progressRate: 0,
      categories: ['백엔드'],
      expiredAt: '2026-01-01T09:00:00',
      categories: ['백엔드', 'Spring'],
      isReviewed: true,
    },
    {
      userId: 'user_001',
      enrollmentId: '5002',
      courseId: '2003',
      courseName: 'React & Next.js 완전 정복',
      status: 'ENROLLED',
      progressRate: 70,
      expiredAt: '2025-12-31T09:00:00',
      categories: ['프론트엔드', 'React'],
      isReviewed: false,
    },
    {
      userId: 'user_001',
      enrollmentId: '5003',
      courseId: '2004',
      courseName: '데이터베이스 기초',
      status: 'ENROLLED',
      progressRate: 20,
      expiredAt: '2026-03-10T09:00:00',
      categories: ['데이터베이스'],
      isReviewed: false,
    },
  ],
  totalElements: 3,
  totalPages: 1,
  pageNumber: 0,
  pageSize: 30,
};
