import { http, HttpResponse, PathParams } from 'msw';
import type { ApiResponse } from '@/shared/lib/api/fetchApi';
import type {
  GetInstructorRequestsResponse,
  ProcessInstructorRequestResponse,
  InstructorRequest,
  InstructorRequestStatus,
} from '@/domains/admin/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

// 공통 응답 헬퍼
const ok = <T>(data: T): ApiResponse<T> => ({
  status: '200',
  code: 'SU001',
  message: '성공',
  data,
});

// Mock 강사 요청 데이터
let mockInstructorRequests: InstructorRequest[] = [
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

export const adminHandlers = [
  // 강사 요청 목록 조회
  http.get<PathParams, never, ApiResponse<GetInstructorRequestsResponse>>(
    `${BASE_URL}/api/admin/instructor-requests`,
    async ({ request }) => {
      const url = new URL(request.url);
      const status = url.searchParams.get('status') as InstructorRequestStatus | null;

      const filtered = status
        ? mockInstructorRequests.filter((r) => r.status === status)
        : mockInstructorRequests;

      const data: GetInstructorRequestsResponse = {
        requests: filtered,
        total: filtered.length,
      };

      return HttpResponse.json<ApiResponse<GetInstructorRequestsResponse>>(
        ok<GetInstructorRequestsResponse>(data),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  ),

  // 강사 요청 승인/거절 처리
  http.patch<{ requestId: string }, { action: 'approve' | 'reject' }, ApiResponse<ProcessInstructorRequestResponse | null>>(
    `${BASE_URL}/api/admin/instructor-requests/:requestId`,
    async ({ params, request }) => {
      const { requestId } = params;
      const body = await request.json();
      const { action } = body;

      const requestItem = mockInstructorRequests.find((r) => r.id === requestId);
      if (!requestItem) {
        return HttpResponse.json<ApiResponse<ProcessInstructorRequestResponse | null>>(
          {
            status: '404',
            code: 'ER404',
            message: '요청을 찾을 수 없습니다.',
            data: null,
          },
          { status: 404 }
        );
      }

      const newStatus: InstructorRequestStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
      const processedAt = new Date().toISOString();

      // Mock 데이터 업데이트
      mockInstructorRequests = mockInstructorRequests.map((r) =>
        r.id === requestId ? { ...r, status: newStatus, processedAt } : r
      );

      const data: ProcessInstructorRequestResponse = {
        requestId,
        status: newStatus,
        processedAt,
      };

      return HttpResponse.json<ApiResponse<ProcessInstructorRequestResponse>>(
        ok<ProcessInstructorRequestResponse>(data),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  ),
];
