import type { InstructorRequest } from '@/domains/admin/types/admin';

// 초기 seed 데이터 (읽기 전용)
export const MOCK_INSTRUCTOR_REQUESTS: InstructorRequest[] = [
  {
    id: 'req-1',
    userId: 'user-001',
    email: 'kim@example.com',
    nickname: '김강사',
    status: 'PENDING',
    requestedAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'req-2',
    userId: 'user-002',
    email: 'lee@example.com',
    nickname: '이강사',
    status: 'PENDING',
    requestedAt: '2026-02-03T14:30:00Z',
  },
  {
    id: 'req-3',
    userId: 'user-003',
    email: 'park@example.com',
    nickname: '박강사',
    status: 'PENDING',
    requestedAt: '2026-02-05T11:00:00Z',
  },
  {
    id: 'req-4',
    userId: 'user-004',
    email: 'choi@example.com',
    nickname: '최강사',
    status: 'APPROVED',
    requestedAt: '2026-01-15T10:00:00Z',
    processedAt: '2026-01-16T09:00:00Z',
  },
  {
    id: 'req-5',
    userId: 'user-005',
    email: 'jung@example.com',
    nickname: '정강사',
    status: 'REJECTED',
    requestedAt: '2026-01-20T16:00:00Z',
    processedAt: '2026-01-21T10:30:00Z',
  },
];
