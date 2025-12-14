import { getApi } from '@/shared/lib/api/fetchApi';
import type {
  EnrollmentListResponse,
  EnrollmentDetailResponse,
  EnrollmentProgressResponse,
} from '@/domains/user/types/enrollment';

/**
 * 1) 수강 목록 조회
 **/
export async function getEnrollmentList(params?: {
  status?: string;
  page?: number;
  size?: number;
}): Promise<EnrollmentListResponse> {
  const query = new URLSearchParams({
    status: params?.status ?? 'ENROLLED',
    page: String(params?.page ?? 1),
    size: String(params?.size ?? 10),
  });

  return await getApi<EnrollmentListResponse>(`/api/enrollments?${query.toString()}`, {
    cache: 'no-store',
  });
}

/**
 * 2) 수강 단건 조회
 **/
export async function getEnrollmentDetail(enrollmentId: string): Promise<EnrollmentDetailResponse> {
  return await getApi<EnrollmentDetailResponse>(`/api/enrollments/${enrollmentId}`, {
    cache: 'no-store',
  });
}

/**
 * 3) 진도 조회
 **/
export async function getProgress(enrollmentId: string): Promise<EnrollmentProgressResponse> {
  return await getApi<EnrollmentProgressResponse>(`/api/progresses/${enrollmentId}`, {
    cache: 'no-store',
  });
}
