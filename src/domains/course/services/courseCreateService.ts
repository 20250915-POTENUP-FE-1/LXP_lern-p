import type {
  CourseDraftForm,
  SectionDraftForm,
  CreateCourseRequest,
  Category,
  CreateCourseResponse,
} from '../types/course';

import { getApi, patchApi, postApi } from '@/shared/lib/api/fetchApi';
import { createSection } from './sectionCreateService';
import { createLecture } from './lectureCreateService';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const createCourseFormData = (data: any, file?: File) => {
  const formData = new FormData();

  formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  if (file) {
    formData.append('thumbnail', file);
  }
  return formData;
};

// 강좌 생성용 데이터 매핑 함수
const mapDraftToCreateRequest = (draft: CourseDraftForm): CreateCourseRequest => {
  const categoryId = 1;

  const levelMap: Record<string, CreateCourseRequest['courseLevel']> = {
    beginner: 'BEGINNER',
    intermediate: 'INTERMEDIATE',
    advanced: 'ADVANCED',
  };

  const normalizedLevel = draft.level?.toLowerCase() ?? 'beginner';

  return {
    title: draft.title,
    summary: draft.summary,
    description: draft.description,
    thumbnail: draft.thumbnail,
    categoryId: String(categoryId),
    price: draft.price,
    courseLevel: levelMap[normalizedLevel] ?? 'BEGINNER',
  };
};

// 강좌생성 API 호출
export const createDraftCourse = async (
  draftData: CourseDraftForm,
  thumbnailFile?: File,
): Promise<CreateCourseResponse> => {
  const requestBody = mapDraftToCreateRequest(draftData);

  const formData = createCourseFormData(requestBody, thumbnailFile);

  return await postApi<CreateCourseResponse>('/api/instructor/courses', undefined, {
    body: formData,
    credentials: 'include',
  });
};

// 강좌 발행용 - 섹션/강의 데이터 포맷팅 함수
const formatLectureData = (lecDraft: any, lIndex: number) => {
  const resources = lecDraft.resource ?? [];
  const primaryResource = Array.isArray(resources) ? resources[0] : resources;

  const hasValidResource = primaryResource?.resourceType;

  return {
    title: lecDraft.title,
    totalDurationSeconds: lecDraft.duration ?? 0,
    isPreview: lecDraft.isPreview ?? false,
    orderIndex: lIndex + 1,
    resource: hasValidResource
      ? [
          {
            resourceType: primaryResource.resourceType,
            isDownloadable: Boolean(primaryResource.isDownloadable),
            fileUrl: primaryResource.fileUrl,
          },
        ]
      : undefined,
  };
};

// 강좌 발행용 - 섹션/강의 초안 적용 함수
const applySectionDraftsForNewCourse = async (
  courseId: string,
  sectionDrafts: SectionDraftForm[],
): Promise<void> => {
  for (let sIndex = 0; sIndex < sectionDrafts.length; sIndex++) {
    const secDraft = sectionDrafts[sIndex];

    const sectionRes = await createSection(courseId, {
      title: secDraft.title,
      orderIndex: sIndex,
    });
    const sectionId = String(sectionRes.sectionId ?? '');

    for (let lIndex = 0; lIndex < secDraft.lectures.length; lIndex++) {
      const lecDraft = secDraft.lectures[lIndex];

      const formattedData = formatLectureData(lecDraft, lIndex);

      await createLecture(courseId, sectionId, formattedData, lecDraft.file);
    }
  }
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

    await patchApi<void>(`${BASE_URL}/api/instructor/courses/${courseId}`, undefined, {
      body: formData,
      credentials: 'include',
    });

    // 보통 수정 API는 body가 없거나 {status, code, message} 정도만 반환하므로 따로 파싱 안 해도 됨
  } catch (err) {
    console.error('updateDraftCourse 실패:', err);
    throw err instanceof Error ? err : new Error('강좌 수정 중 오류가 발생했습니다.');
  }
};

// 생성된 강좌조회 용 데이터 매핑 함수
const mapRespoonseToCourseDraft = (data: any) => {
  //카테고리
  const category = Array.isArray(data.categoryIds)
    ? data.categoryIds.map((id: unknown) => String(id))
    : data.category
      ? [String(data.category)]
      : [];
  // 강좌 정보 가공
  const courseDraft: CourseDraftForm = {
    title: data.title ?? '',
    summary: data.summary ?? '',
    description: data.description ?? '',
    thumbnail: data.thumbnailUrl ?? '',
    category,
    level: data.courseLevel ?? '',
    price: data.price ?? 0,
    status: data.status ?? 'draft',
  };
  // 섹션 및 강의 정보 가공
  const sectionDrafts: SectionDraftForm[] = (data.sections ?? []).map((sec: any) => ({
    id: String(sec.id),
    title: sec.title ?? '',
    status: sec.status ?? 'draft',
    lectures: (sec.lectures ?? []).map((lec: any) => ({
      id: String(lec.id),
      title: lec.title ?? '',
      duration: lec.totalDurationSeconds ?? 0,
      videoUrl: lec.videoUrl ?? '',
      resource: lec.resource,
    })),
  }));

  return { courseDraft, sectionDrafts };
};

// 임시 생성된 강좌 조회API
export async function fetchCourseWithSections(courseId: string): Promise<{
  courseDraft: CourseDraftForm;
  sectionDrafts: SectionDraftForm[];
}> {
  if (!courseId) throw new Error('Invalid courseId');

  const data = await getApi<any>(`/api/instructor/courses/${courseId}`);

  return mapRespoonseToCourseDraft(data);
}
