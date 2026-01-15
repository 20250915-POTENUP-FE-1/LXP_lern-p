import { postApi, patchApi, deleteApi } from '@/shared/lib/api/fetchApi';
import {
  CreateSectionRequest,
  CreateSectionResponse,
  ReorderSectionsRequest,
  UpdateSectionRequest,
  UpdateSectionResponse,
} from '../types/course';

// 섹션 생성 API
export const createSection = async (
  courseId: string,
  payload: CreateSectionRequest,
): Promise<CreateSectionResponse> => {
  return await postApi<CreateSectionResponse>(
    `/api/instructor/courses/${courseId}/sections`,
    payload,
  );
};

// 섹션 수정 API
export const updateSection = async (
  courseId: string,
  sectionId: string,
  payload: UpdateSectionRequest,
): Promise<UpdateSectionResponse> => {
  return await patchApi<UpdateSectionResponse>(
    `/api/instructor/courses/${courseId}/sections/${sectionId}`,
    payload,
  );
};

// 섹션 삭제 API
export const deleteSection = async (courseId: string, sectionId: string) => {
  return await deleteApi<void>(`/api/instructor/courses/${courseId}/sections/${sectionId}`);
};

// 섹션 순서 변경 API
export const reorderSections = async (courseId: string, payload: ReorderSectionsRequest) => {
  const normalized = {
    sectionIds: payload.sectionIds.map((id) => Number(id)),
  };

  return await patchApi<void>(`/api/instructor/courses/${courseId}/sections/reorder`, normalized);
};
