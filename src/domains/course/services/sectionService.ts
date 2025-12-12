import { postApi, patchApi, deleteApi } from '@/shared/lib/api/fetchApi';

// 섹션 생성 API
export async function createSection(courseId: string, body: { title: string; orderIndex: number }) {
  return postApi<{ sectionId: string }>(`/api/instructor/courses/${courseId}/sections`, body);
}

export async function updateSection(
  courseId: string,
  sectionId: string,
  body: { title: string; orderIndex: number },
) {
  return patchApi(`/api/instructor/courses/${courseId}/sections/${sectionId}`, body);
}

export async function deleteSection(courseId: string, sectionId: string) {
  return deleteApi(`/api/instructor/courses/${courseId}/sections/${sectionId}`);
}
