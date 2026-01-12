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
    },
  ],
  totalElements: 3,
  totalPages: 1,
  pageNumber: 0,
  pageSize: 30,
};
