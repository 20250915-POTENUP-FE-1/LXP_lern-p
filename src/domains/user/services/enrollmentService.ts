import { getApi } from '@/shared/lib/api/fetchApi';
import type {
  EnrollmentListResponse,
  EnrollmentDetailResponse,
  EnrollmentProgressResponse,
} from '@/domains/user/types/enrollment';
import type { GetEnrollmentResponse } from '@/domains/course/types/course';

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

export async function getProgress(courseId: string): Promise<EnrollmentProgressResponse> {
  return await getApi<EnrollmentProgressResponse>(`/api/progresses/course/${courseId}`, {
    cache: 'no-store',
  });
}
