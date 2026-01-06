import { postApi, patchApi, deleteApi } from '@/shared/lib/api/fetchApi';

// 섹션 생성 API
export async function createSection(courseId: string, body: { title: string; orderIndex: number }) {
  return postApi<{ sectionId: string }>(`/api/instructor/courses/${courseId}/sections`, body);
}

// 섹션 수정 API
export async function updateSection(
  courseId: string,
  sectionId: string,
  body: { title: string; orderIndex: number },
) {
  return patchApi(`/api/instructor/courses/${courseId}/sections/${sectionId}`, body);
}

// 섹션 삭제 API
export async function deleteSection(courseId: string, sectionId: string) {
  return deleteApi(`/api/instructor/courses/${courseId}/sections/${sectionId}`);
}

// 섹션 순서 변경 API
export const reorderSections = async (courseId: string, sectionIds: string[]): Promise<void> => {
  if (!courseId) throw new Error('Invalid courseId');

  await patchApi<void>(`/api/instructor/courses/${courseId}/sections/reorder`, { sectionIds });
};
