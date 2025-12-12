import { postApi, patchApi, deleteApi } from '@/shared/lib/api/fetchApi';
import { LectureResource } from '../types/course';

// 강의 생성 API
export async function createLecture(
  courseId: string,
  sectionId: string,
  body: {
    title: string;
    totalDurationSeconds?: number;
    isPreview: boolean;
    orderIndex: number;
    resource?: LectureResource[];
  },
) {
  return postApi<{ lectureId: string }>(
    `/api/instructor/courses/${courseId}/sections/${sectionId}/lectures`,
    body,
  );
}

// 강의 수정 API
export async function updateLecture(
  courseId: string,
  lectureId: string,
  body: {
    title: string;
    totalDurationSeconds?: number;
    isPreview: boolean;
    resource: LectureResource;
  },
) {
  // 스펙 그대로면 PUT, 백엔드가 PATCH 허용하면 patchApi 유지
  return patchApi(`/api/instructor/courses/${courseId}/lectures/${lectureId}`, body);
}

// 강의 삭제 API
export async function deleteLecture(courseId: string, lectureId: string) {
  return deleteApi(`/api/instructor/courses/${courseId}/lectures/${lectureId}`);
}
