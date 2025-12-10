import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  updateStudentToInstructorResponse,
  UserResponse,
} from '@/domains/user/types/user';
import { getApi, patchApi, postApi } from '@/shared/lib/api/fetchApi';

/**
 * 사용자 프로필 조회
 */
export const getUserProfile = async (): Promise<UserResponse> => {
  return await getApi<UserResponse>(`/api/users/me`);
};

/**
 * 사용자 프로필 업데이트
 */
export const updateProfile = async ({
  nickname,
}: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  return await patchApi<UpdateProfileResponse>('/api/users/me', { nickname });
};

/** 수강생 -> 강사
 */
export const updateStudentToInstructor = async (
  userId: string,
): Promise<updateStudentToInstructorResponse> => {
  return await postApi<updateStudentToInstructorResponse>(
    `/api/admin/users/${userId}/roles/instructor`,
    {},
  );
};
