import { getApi } from '@/shared/lib/api/fetchApi';
import type {
  EnrollmentListPage,
  EnrollmentDetail,
  EnrollmentProgress,
} from '@/domains/user/types/enrollment';

/** ===============================
 * 1) 수강 목록 조회
 * GET /api/enrollments?status=ENROLLED&page=1&size=10
 * =============================== */
export async function getEnrollmentList(params?: {
  status?: string;
  page?: number;
  size?: number;
}): Promise<EnrollmentListPage> {
  const query = new URLSearchParams({
    status: params?.status ?? 'ENROLLED',
    page: String(params?.page ?? 1),
    size: String(params?.size ?? 10),
  });

  return await getApi<EnrollmentListPage>(`/api/enrollments?${query.toString()}`, {
    cache: 'no-store',
  });
}

/** ===============================
 * 2) 수강 단건 조회
 * GET /api/enrollments/{enrollmentId}
 * =============================== */
export async function getEnrollmentDetail(enrollmentId: string): Promise<EnrollmentDetail> {
  return await getApi<EnrollmentDetail>(`/api/enrollments/${enrollmentId}`, {
    cache: 'no-store',
  });
}

/** ===============================
 * 3) 진도 조회
 * GET /api/progresses/{enrollmentId}
 * =============================== */
export async function getProgress(enrollmentId: string): Promise<EnrollmentProgress> {
  return await getApi<EnrollmentProgress>(`/api/progresses/${enrollmentId}`, {
    cache: 'no-store',
  });
}
