import type { InstructorApplication } from '@/domains/admin/types/admin';

export const MOCK_INSTRUCTOR_REQUESTS: InstructorApplication[] = [
  {
    applicationId: 1,
    userId: 1,
    email: 'kim@example.com',
    name: '김강사',
    status: 'PENDING',
    appliedAt: '2026-02-01T09:00:00Z',
  },
  {
    applicationId: 2,
    userId: 2,
    email: 'lee@example.com',
    name: '이강사',
    status: 'PENDING',
    appliedAt: '2026-02-03T14:30:00Z',
  },
  {
    applicationId: 3,
    userId: 3,
    email: 'park@example.com',
    name: '박강사',
    status: 'PENDING',
    appliedAt: '2026-02-05T11:00:00Z',
  },
  {
    applicationId: 4,
    userId: 4,
    email: 'choi@example.com',
    name: '최강사',
    status: 'APPROVED',
    appliedAt: '2026-01-15T10:00:00Z',
  },
  {
    applicationId: 5,
    userId: 5,
    email: 'jung@example.com',
    name: '정강사',
    status: 'REJECTED',
    appliedAt: '2026-01-20T16:00:00Z',
  },
];
