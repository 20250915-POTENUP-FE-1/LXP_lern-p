import {
  CourseDraftForm,
  CreateLectureResponse,
  CreateSectionResponse,
  SectionDraftForm,
} from '../types/course';
import { getApi, postApi, patchApi, deleteApi } from '@/shared/lib/api/fetchApi';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

type ApiEnvelope<T> = {
  status: string;
  code: string;
  message: string;
  data: T;
};

// 1) 강좌 기본정보 수정 (PATCH)
export const updateDraftCourse = async (
  courseId: string,
  payload: Partial<CourseDraftForm>,
): Promise<void> => {
  if (!courseId) throw new Error('Invalid courseId');

  try {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

    // 썸네일 변경이 포함되는 경우를 대비해서 추후 확장 가능
    // if (thumbnailFile) {
    //   formData.append('thumbnail', thumbnailFile);
    // }

    const url = `${BASE_URL}/api/instructor/courses/${courseId}`;
    const res = await fetch(url, {
      method: 'PATCH',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`강좌 수정 실패: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
    }

    // 보통 수정 API는 body가 없거나 {status, code, message} 정도만 반환하므로 따로 파싱 안 해도 됨
  } catch (err) {
    console.error('updateDraftCourse 실패:', err);
    throw err instanceof Error ? err : new Error('강좌 수정 중 오류가 발생했습니다.');
  }
};

// 섹션 생성 API
export const createSection = async (
  courseId: string,
  payload: { title: string; orderIndex: number },
): Promise<CreateSectionResponse> => {
  if (!courseId) throw new Error('Invalid courseId');

  const result = await postApi<CreateSectionResponse>(
    `/api/instructor/courses/${courseId}/sections`,
    payload,
  );
  return result;
};

// 섹션 수정 API
export const updateSection = async (
  courseId: string,
  sectionId: string,
  payload: { title?: string; orderIndex?: number },
): Promise<void> => {
  if (!courseId || !sectionId) throw new Error('Invalid section params');

  await patchApi<void>(`/api/instructor/courses/${courseId}/sections/${sectionId}`, payload);
  //(`/instructor/courses/${courseId}/sections/${sectionId}`, payload)
};

// 섹션 삭제 API
export const deleteSection = async (courseId: string, sectionId: string): Promise<void> => {
  if (!courseId || !sectionId) throw new Error('Invalid section params');

  await deleteApi<void>(`/api/instructor/courses/${courseId}/sections/${sectionId}`);
};

// 강의 생성 API
/*
export const createLecture = async (
  courseId: string,
  sectionId: string,
  payload: {
    title: string;
    totalDurationSeconds: number;
    isPreview: boolean;
    orderIndex: number;
    resource?: { isDownloadable: boolean };
  },
  file?: File,
): Promise<CreateLectureResponse> => {
  if (!courseId || !sectionId) {
    throw new Error('Invalid lecture params');
  }

  const formData = new FormData();

  // JSON → request 파트
  formData.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

  // 파일 파트 (있을 때만)
  if (file) {
    formData.append('file', file);
  }

  return await postApi<CreateLectureResponse>(
    `/api/instructor/courses/${courseId}/sections/${sectionId}/lectures`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
      // multipart/form-data 사용을 위해 Content-Type 제거
      headers: {
        'Content-Type': undefined as unknown as string,
      },
    },
  );
};
*/
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

  // API 명세: resourceType/fileUrl은 요청에 포함하지 않고, resource는 단일 객체 { isDownloadable }
  const requestBody = {
    ...payload,
    resource: payload.resource?.[0]
      ? { isDownloadable: Boolean(payload.resource[0].isDownloadable) }
      : { isDownloadable: false },
  };

  formData.append('request', new Blob([JSON.stringify(requestBody)], { type: 'application/json' }));

  if (file) {
    formData.append('file', file);
  }

  // 백엔드 엔드포인트로 직접 전송 (대용량 업로드 타임아웃 회피 + Next 라우트 경유 제거)
  const accessToken =
    typeof document !== 'undefined'
      ? document.cookie
          .split('; ')
          .find((c) => c.startsWith('accessToken='))
          ?.split('=')[1]
      : undefined;

  console.log(accessToken ? '✅ accessToken 포함' : '❌ accessToken 없음');
  const res = await fetch(
    `${BASE_URL}/api/instructor/courses/${courseId}/sections/${sectionId}/lectures`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    },
  );
  console.log('📤 강의 생성 응답:', res);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`강의 생성 실패: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
  }

  const json = (await res.json()) as ApiEnvelope<CreateLectureResponse>;
  if (json.code?.startsWith('E')) {
    throw new Error(json.message || '강의 생성 중 오류가 발생했습니다.');
  }

  return json.data;
};

// 강의 수정 API (PUT → PATCH로 바꾸고 싶으면 여기서 조정)
export const updateLecture = async (
  courseId: string,
  lectureId: string,
  payload: {
    title?: string;
    totalDurationSeconds?: number;
    isPreview?: boolean;
    orderIndex?: number;
    resource?: any[];
  },
): Promise<void> => {
  if (!courseId || !lectureId) throw new Error('Invalid lecture params');

  await patchApi<void>(`/api/instructor/courses/${courseId}/lectures/${lectureId}`, payload);
};

// 강의 삭제 API
export const deleteLecture = async (courseId: string, lectureId: string): Promise<void> => {
  if (!courseId || !lectureId) throw new Error('Invalid lecture params');

  await deleteApi<void>(`/api/instructor/courses/${courseId}/lectures/${lectureId}`);
};

// 8) 섹션 순서 변경 API
export const reorderSections = async (courseId: string, sectionIds: string[]): Promise<void> => {
  if (!courseId) throw new Error('Invalid courseId');

  await patchApi<void>(`/api/instructor/courses/${courseId}/sections/reorder`, { sectionIds });
};

// 9) 강의 순서 변경 API
export const reorderLectures = async (sectionId: string, lectureIds: string[]): Promise<void> => {
  if (!sectionId) throw new Error('Invalid sectionId');

  await patchApi<void>(`/api/instructor/sections/${sectionId}/lectures/reorder`, { lectureIds });
};

// 강좌 수정 API 호출
export const fetchCourseData = async (courseId: string): Promise<CourseDraftForm> => {
  if (!courseId) throw new Error('Invalid courseId');

  // fetchApi/getApi는 이미 { status, code, message, data } 중 data만 반환한다고 가정
  const c = await getApi<any>(`/api/instructor/courses/${courseId}`);

  const category = Array.isArray(c.categoryIds)
    ? c.categoryIds.map((id: unknown) => String(id))
    : c.category
      ? [String(c.category)]
      : [];

  return {
    title: c.title ?? '',
    summary: c.summary ?? '',
    description: c.description ?? '',
    thumbnail: c.thumbnailUrl ?? '',
    category,
    level: c.courseLevel ?? '',
    price: c.price ?? 0,
  };
};

// 강좌 수정 API 호출 - 섹션+강의 포함
export async function fetchCourseWithSections(courseId: string): Promise<{
  courseDraft: CourseDraftForm;
  sectionDrafts: SectionDraftForm[];
}> {
  if (!courseId) throw new Error('Invalid courseId');

  const data = await getApi<any>(`/api/instructor/courses/${courseId}`);

  const category = Array.isArray(data.categoryIds)
    ? data.categoryIds.map((id: unknown) => String(id))
    : data.category
      ? [String(data.category)]
      : [];

  const courseDraft: CourseDraftForm = {
    title: data.title ?? '',
    summary: data.summary ?? '',
    description: data.description ?? '',
    thumbnail: data.thumbnailUrl ?? '',
    category,
    level: data.courseLevel ?? '',
    price: data.price ?? 0,
  };

  const sectionDrafts: SectionDraftForm[] = (data.sections ?? []).map((sec: any) => ({
    id: String(sec.id),
    title: sec.title ?? '',
    lectures: (sec.lectures ?? []).map((lec: any) => ({
      id: String(lec.id),
      title: lec.title ?? '',
      duration: lec.totalDurationSeconds ?? 0,
      videoUrl: lec.videoUrl ?? '',
      resource: lec.resource,
    })),
  }));

  return { courseDraft, sectionDrafts };
}
