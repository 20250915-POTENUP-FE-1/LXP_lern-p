import type {
  GetInstructorRequestsResponse,
  ProcessInstructorRequestResponse,
  InstructorRequest,
  InstructorRequestStatus,
} from '../types';
import { USE_MOCK } from '@/shared/constants/config';

// Mock 데이터
const MOCK_INSTRUCTOR_REQUESTS: InstructorRequest[] = [
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

// Mock 데이터 상태 관리 (승인/거절 시 상태 변경용)
let mockRequests = [...MOCK_INSTRUCTOR_REQUESTS];

/**
 * 강사 요청 목록 조회
 */
export const getInstructorRequests = async (
  status?: InstructorRequestStatus
): Promise<GetInstructorRequestsResponse> => {
  if (USE_MOCK) {
    const filtered = status
      ? mockRequests.filter((r) => r.status === status)
      : mockRequests;
    return {
      requests: filtered,
      total: filtered.length,
    };
  }

  // 실제 API 호출
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const url = status
    ? `${BASE_URL}/api/admin/instructor-requests?status=${status}`
    : `${BASE_URL}/api/admin/instructor-requests`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

/**
 * 강사 요청 승인/거절 처리
 */
export const processInstructorRequest = async (
  requestId: string,
  action: 'approve' | 'reject'
): Promise<ProcessInstructorRequestResponse> => {
  if (USE_MOCK) {
    const request = mockRequests.find((r) => r.id === requestId);
    if (!request) {
      throw new Error('요청을 찾을 수 없습니다.');
    }

    const newStatus: InstructorRequestStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
    const processedAt = new Date().toISOString();

    // Mock 데이터 업데이트
    mockRequests = mockRequests.map((r) =>
      r.id === requestId ? { ...r, status: newStatus, processedAt } : r
    );

    return {
      requestId,
      status: newStatus,
      processedAt,
    };
  }

  // 실제 API 호출
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const response = await fetch(`${BASE_URL}/api/admin/instructor-requests/${requestId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const result = await response.json();
  return result.data;
};

/**
 * Mock 데이터 리셋 (테스트용)
 */
export const resetMockData = () => {
  mockRequests = [...MOCK_INSTRUCTOR_REQUESTS];
};
