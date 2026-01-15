import { postApi, deleteApi, putApi } from '@/shared/lib/api/fetchApi';
import {
  CreateLectureRequest,
  CreateLectureResourcePresignedUrlResponse,
  CreateLectureResponse,
  UpdateLectureRequest,
  UpdateLectureResponse,
} from '../types/course';

// 강의 생성 API
export const createLecture = async (
  courseId: string,
  sectionId: string,
  payload: CreateLectureRequest,
): Promise<CreateLectureResponse> => {
  return await postApi<CreateLectureResponse>(
    `/api/instructor/courses/${courseId}/sections/${sectionId}/lectures`,
    payload,
    { credentials: 'include' },
  );
};

// 강의 삭제 API
export async function deleteLecture(courseId: string, lectureId: string) {
  return deleteApi(`/api/instructor/courses/${courseId}/lectures/${lectureId}`, {
    credentials: 'include',
  });
}

// 강의 자료 업로드 presigned url 생성
export const createLectureResourcePresignedUrl = async (
  lectureId: string,
): Promise<CreateLectureResourcePresignedUrlResponse> => {
  return await postApi<CreateLectureResourcePresignedUrlResponse>(
    `/api/instructor/lectures/${lectureId}/resources`,
    {},
    { credentials: 'include' },
  );
};

// presigned url 로 실제 업로드 API
export const uploadLectureResourceToPresignedUrl = async ({
  presignedUrl,
  file,
  contentType,
}: {
  presignedUrl: string;
  file: File | Blob;
  contentType: string;
}) => {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': contentType,
    },
  });
};

// 리소스 삭제 API
export async function deleteLectureResource(resourceId: string) {
  return deleteApi(`/api/instructor/resources/${resourceId}`, {
    credentials: 'include',
  });
}

// 강의 수정 API (임시강의생성수정 API)
export async function updateLecture(
  courseId: string,
  lectureId: string,
  body: UpdateLectureRequest,
): Promise<UpdateLectureResponse> {
  return putApi<UpdateLectureResponse>(
    `/api/instructor/courses/${courseId}/lectures/${lectureId}`,
    body,
    { credentials: 'include' },
  );
}
