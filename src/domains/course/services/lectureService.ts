import { postApi, patchApi, deleteApi, fetchApi } from '@/shared/lib/api/fetchApi';
import { CreateLectureResponse, LectureResource } from '../types/course';

// 강의 생성 API
export const createLecture = async (
  courseId: string,
  sectionId: string,
  payload: {
    title: string;
    totalDurationSeconds: number;
    isPreview: boolean;
    orderIndex: number;
    resource?: {
      resourceType: string;
      isDownloadable: boolean;
      fileUrl?: string;
    }[];
  },
  file?: File,
): Promise<CreateLectureResponse> => {
  if (!courseId || !sectionId) throw new Error('Invalid lecture params');

  const formData = new FormData();

  formData.append('request', new Blob([JSON.stringify(payload)], { type: 'multipart/form-data' }));

  if (file) {
    formData.append('file', file);
  }

  console.log('📤 강의 생성 요청:', {
    courseId,
    sectionId,
    payload,
    hasFile: !!file,
  });

  return await fetchApi<CreateLectureResponse>(
    `/api/instructor/courses/${courseId}/sections/${sectionId}/lectures`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
    },
  );
};

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
