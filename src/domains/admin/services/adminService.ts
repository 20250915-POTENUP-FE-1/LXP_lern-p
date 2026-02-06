import { getApi, patchApi } from '@/shared/lib/api/fetchApi';
import type {
  GetInstructorRequestsResponse,
  ProcessInstructorRequestResponse,
  InstructorRequestStatus,
  AdminStats,
} from '../types/admin';

/**
 * 강사 요청 목록 조회
 */
export const getInstructorRequests = (status?: InstructorRequestStatus) => {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  return getApi<GetInstructorRequestsResponse>(`/api/admin/instructor-requests${qs}`);
};

/**
 * 강사 요청 승인/거절 처리
 */
export const processInstructorRequest = (requestId: string, action: 'approve' | 'reject') => {
  if (!requestId) throw new Error('Invalid requestId');

  return patchApi<ProcessInstructorRequestResponse>(
    `/api/admin/instructor-requests/${encodeURIComponent(requestId)}`,
    { action },
  );
};

/**
 * 관리자 대시보드 통계 조회
 */
export const getAdminStats = () => {
  return getApi<AdminStats>('/api/admin/stats');
};
