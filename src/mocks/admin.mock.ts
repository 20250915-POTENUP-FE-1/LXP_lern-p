import type { InstructorRequest } from '@/domains/admin/types/admin';

// 초기 seed 데이터 (읽기 전용)
export const MOCK_INSTRUCTOR_REQUESTS: InstructorRequest[] = [
  {
    id: 1,
    userId: 'userID-1',
    email: 'kim@example.com',
    nickname: '김강사',
    status: 'PENDING',
    requestedAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 2,
    userId: 'userID-2',
    email: 'lee@example.com',
    nickname: '이강사',
    status: 'PENDING',
    requestedAt: '2026-02-03T14:30:00Z',
  },
  {
    id: 3,
    userId: 'userID-3',
    email: 'park@example.com',
    nickname: '박강사',
    status: 'PENDING',
    requestedAt: '2026-02-05T11:00:00Z',
  },
  {
    id: 4,
    userId: 'userID-4',
    email: 'choi@example.com',
    nickname: '최강사',
    status: 'APPROVED',
    requestedAt: '2026-01-15T10:00:00Z',
    processedAt: '2026-01-16T09:00:00Z',
  },
  {
    id: 5,
    userId: 'userID-5',
    email: 'jung@example.com',
    nickname: '정강사',
    status: 'REJECTED',
    requestedAt: '2026-01-20T16:00:00Z',
    processedAt: '2026-01-21T10:30:00Z',
  },
];
