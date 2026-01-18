import { getApi } from '@/shared/lib/api/fetchApi';
import type {
  EnrollmentListResponse,
  EnrollmentDetailResponse,
} from '@/domains/user/types/enrollment';
import { LearnEnrollmentResponse } from '@/domains/course/types/learn';
import { GetEnrollmentResponse } from '@/domains/course/types/course';

// 수강 정보 조회 (강좌 ID 기준)
export const getEnrollmentByCourseId = async (
  courseId: string,
): Promise<GetEnrollmentResponse | null> => {
  try {
    return await getApi<GetEnrollmentResponse | null>(`/api/enrollments/course/${courseId}`, {
      cache: 'no-store',
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('[404 (EE004)')) {
      return null;
    }
    throw err;
  }
};

// 수강 정보 조회 (수강 ID 기준)
export async function getEnrollmentByEnrollmentId(
  enrollmentId: string,
): Promise<LearnEnrollmentResponse> {
  return getApi(`/api/enrollments/${enrollmentId}`, { cache: 'no-store' });
}

export async function getEnrollmentList(params?: {
  status?: string;
  page?: number;
  size?: number;
}): Promise<EnrollmentListResponse> {
  const query = new URLSearchParams({
    status: params?.status ?? 'ENROLLED',
    page: String(params?.page ?? 0),
    size: String(params?.size ?? 10),
  });

  return await getApi<EnrollmentListResponse>(`/api/enrollments?${query.toString()}`, {
    cache: 'no-store',
  });
}

export async function getEnrollmentDetail(enrollmentId: string): Promise<EnrollmentDetailResponse> {
  return await getApi<EnrollmentDetailResponse>(`/api/enrollments/${enrollmentId}`, {
    cache: 'no-store',
  });
}
