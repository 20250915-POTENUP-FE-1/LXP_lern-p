import { getApi, patchApi } from '@/shared/lib/api/fetchApi';
import type {
  ApplicationStatus,
  GetInstructorApplicationsParams,
  GetInstructorApplicationsResponse,
} from '../types/admin';

/**
 * 강사 요청 목록 조회
 */
export async function getInstructorApplicaions(
  params?: GetInstructorApplicationsParams,
): Promise<GetInstructorApplicationsResponse> {
  const query = new URLSearchParams();

  query.set('page', String(params?.page ?? 0));
  query.set('size', String(params?.size ?? 10));

  if (params?.status) {
    query.set('status', params.status);
  }

  return getApi<GetInstructorApplicationsResponse>(
    `/api/users/instructor/applications?${query.toString()}`,
  );
}

/**
 * 강사 요청 승인/거절
 */
export const processInstructorApplication = async (status: ApplicationStatus): Promise<void> => {
  await patchApi<void>(`/api/users/instructor/applications`, { status });
};

/**
 * 관리자 대시보드 통계 조회
 */
