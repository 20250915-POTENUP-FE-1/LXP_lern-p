import type {
  CourseDraftForm,
  SectionDraftForm,
  Category,
  CreateCourseResponse,
  GetDraftCourseResponse,
} from '../types/course';

import { getApi, patchApi, postApi } from '@/shared/lib/api/fetchApi';
import {
  applySectionDraftsForNewCourse,
  createCourseFormData,
  mapDraftToCreateRequest,
  mapResponseToCourseDraft,
} from '../utils/courseCreate';

// 강좌생성 API 호출
export const createDraftCourse = async (
  draftData: CourseDraftForm,
  thumbnailFile?: File,
): Promise<CreateCourseResponse> => {
  const requestBody = mapDraftToCreateRequest(draftData);

  const formData = createCourseFormData(requestBody, thumbnailFile);

  return await postApi<CreateCourseResponse>('/api/instructor/courses', null, {
    body: formData,
    credentials: 'include',
  });
};

// 강좌 발행 API 호출
export const publishDraftCourse = async (courseId: string): Promise<void> => {
  return await patchApi<void>(`/api/instructor/courses/${courseId}/publish`);
};

export const createCourse = async (
  courseDraft: CourseDraftForm,
  sectionDrafts: SectionDraftForm[],
  shouldPublish: boolean = false,
): Promise<CreateCourseResponse> => {
  try {
    const { courseId } = await createDraftCourse(courseDraft);
    await applySectionDraftsForNewCourse(courseId, sectionDrafts);

    if (shouldPublish) {
      await publishDraftCourse(courseId);
    }

    return { courseId };
  } catch (err) {
    console.error('createCourse 실패:', err);
    throw new Error('강좌 등록 중 오류가 발생했습니다.');
  }
};

// 카테고리 조회 API
export const getCategories = async (): Promise<Category[]> => {
  if (process.env.NODE_ENV === 'development') {
    return [
      {
        categoryId: 1,
        name: '프로그래밍',
        children: [
          { categoryId: 2, name: '프론트엔드' },
          { categoryId: 3, name: '백엔드' },
        ],
      },
      {
        categoryId: 4,
        name: '디자인',
        children: [{ categoryId: 5, name: 'UI/UX' }],
      },
    ];
  }
  try {
    const categories = await getApi<Category[]>('/api/categories');
    return categories;
  } catch (err) {
    console.error('getCategories 실패:', err);
    throw new Error('카테고리 목록을 불러오는 중 오류가 발생했습니다.');
  }
};

// 강좌 수정 API
export const updateDraftCourse = async (
  courseId: string,
  payload: Partial<CourseDraftForm>,
): Promise<void> => {
  if (!courseId) throw new Error('Invalid courseId');

  try {
    const formData = createCourseFormData(payload);

    await patchApi<void>(`/api/instructor/courses/${courseId}`, null, {
      body: formData,
      credentials: 'include',
    });

    // 보통 수정 API는 body가 없거나 {status, code, message} 정도만 반환하므로 따로 파싱 안 해도 됨
  } catch (err) {
    console.error('updateDraftCourse 실패:', err);
    throw err instanceof Error ? err : new Error('강좌 수정 중 오류가 발생했습니다.');
  }
};

// 임시 생성된 강좌 조회API
export async function getDraftCourse(courseId: string): Promise<{
  courseDraft: CourseDraftForm;
  sectionDrafts: SectionDraftForm[];
}> {
  if (!courseId) throw new Error('Invalid courseId');

  const data = await getApi<GetDraftCourseResponse>(`/api/instructor/courses/${courseId}`);

  return mapResponseToCourseDraft(data);
}
