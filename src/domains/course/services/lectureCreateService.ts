import { postApi, deleteApi, putApi } from '@/shared/lib/api/fetchApi';
import {
  CreateLectureRequest,
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
  );
};

// 강의 삭제 API
export async function deleteLecture(courseId: string, lectureId: string) {
  return deleteApi(`/api/instructor/courses/${courseId}/lectures/${lectureId}`);
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
  );
}
