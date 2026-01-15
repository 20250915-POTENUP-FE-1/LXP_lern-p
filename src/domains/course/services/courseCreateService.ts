import { getApi, patchApi, postApi, putApi } from '@/shared/lib/api/fetchApi';
import type {
  CourseDraftForm,
  SectionDraftForm,
  Category,
  CreateCourseResponse,
  GetDraftCourseResponse,
  CreateCourseRequest,
  PublishCourseResponse,
  UpdateLectureRequest,
  UpdateLectureResponse,
} from '../types/course';

import {
  createCourseFormData,
  mapDraftToCreateRequest,
  mapResponseToCourseDraft,
} from '../utils/courseCreate';

// 강좌 생성 API
// export const createDraftCourse = async (
//   draftData: CourseDraftForm,
//   thumbnailFile?: File,
// ): Promise<CreateCourseResponse> => {
//   const requestBody = mapDraftToCreateRequest(draftData);

//   const formData = createCourseFormData(requestBody, thumbnailFile);

//   return await postApi<CreateCourseResponse>('/api/instructor/courses', null, {
//     body: formData,
//     credentials: 'include',
//   });
// };

// 강좌 발행 API
export const publishCourse = async (courseId: string): Promise<PublishCourseResponse> => {
  return await patchApi<PublishCourseResponse>(`/api/instructor/courses/${courseId}/publish`);
};

// 강좌 생성 API
export const createCourse = async (payload: CreateCourseRequest): Promise<CreateCourseResponse> => {
  const data = await postApi<{ courseId: string | number }>(`/api/instructor/courses`, payload);

  return {
    courseId: String(data.courseId),
  };
};

// 카테고리 조회 API
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await getApi<Category[]>('/api/categories');
    return categories;
  } catch (err) {
    console.error('getCategories 실패:', err);
    throw new Error('카테고리 목록을 불러오는 중 오류가 발생했습니다.');
  }
};

// 강좌 수정 API (임시생성 강좌 수정 이용)
export const updateLecture = async (
  courseId: string,
  lectureId: string,
  payload: UpdateLectureRequest,
): Promise<UpdateLectureResponse> => {
  return await putApi<UpdateLectureResponse>(
    `/api/instructor/courses/${courseId}/lectures/${lectureId}`,
    payload,
  );
};

// 임시 생성된 강좌 조회 API
export async function getDraftCourse(courseId: string): Promise<{
  courseDraft: CourseDraftForm;
  sectionDrafts: SectionDraftForm[];
}> {
  if (!courseId) throw new Error('Invalid courseId');

  const data = await getApi<GetDraftCourseResponse>(`/api/instructor/courses/${courseId}`);

  return mapResponseToCourseDraft(data);
}
