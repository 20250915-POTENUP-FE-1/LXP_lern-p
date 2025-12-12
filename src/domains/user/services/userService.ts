import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdateStudentToInstructorResponse,
  UserResponse,
} from '@/domains/user/types/user';
import { getApi, patchApi } from '@/shared/lib/api/fetchApi';

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
export const updateStudentToInstructor = async (): Promise<UpdateStudentToInstructorResponse> => {
  return await patchApi<UpdateStudentToInstructorResponse>(`/api/users/me/roles/instructor`);
};

/**
 * 사용자 프로필 조회
 */
export const getProfile = async ({
  nickname,
}: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  return await patchApi<UpdateProfileResponse>('/api/users/me', { nickname });
};

/**
 * 닉네임 수정
 */
export async function updateMyProfile(payload: { nickname?: string }) {
  return getApi('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
