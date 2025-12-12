import type {
  CourseDraftForm,
  SectionDraftForm,
  CreateCourseRequest,
  LectureResource,
  Category,
  CreateCourseResponse,
} from '../types/course';

import { fetchApi, getApi, patchApi, postApi } from '@/shared/lib/api/fetchApi';
import { createSection } from './sectionService';
import { createLecture } from './lectureService';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

      const resources = lecDraft.resource ?? [];
      const primaryResource: LectureResource | undefined = Array.isArray(resources)
        ? resources[0]
        : (resources as any);

      const totalDurationSeconds = lecDraft.duration ?? 0;

      const hasValidResource =
        primaryResource &&
        primaryResource.resourceType &&
        primaryResource.resourceType !== undefined;

      await createLecture(
        courseId,
        sectionId,
        {
          title: lecDraft.title,
          totalDurationSeconds,
          isPreview: lecDraft.isPreview ?? false,
          orderIndex: lIndex + 1,
          resource: hasValidResource
            ? [
                {
                  resourceType: primaryResource.resourceType!, // ← ! 단언 (이미 체크함)
                  // 백엔드 스펙상 boolean 필수이므로 기본값 false 보장
                  isDownloadable: Boolean(primaryResource.isDownloadable),
                  fileUrl: primaryResource.fileUrl,
                },
              ]
            : undefined,
        },
        lecDraft.file,
      );
    }
  }
};
// 강좌생성 API 호출
export const createDraftCourse = async (
  draftData: CourseDraftForm,
  thumbnailFile?: File,
): Promise<CreateCourseResponse> => {
  const requestBody = mapDraftToCreateRequest(draftData);

  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(requestBody)], { type: 'application/json' }));

  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
  }

  return await fetchApi<CreateCourseResponse>('/api/instructor/courses', {
    method: 'POST',
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

// 카테고리 조회 API 호출
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await getApi<Category[]>('/api/categories');
    return categories;
  } catch (err) {
    console.error('getCategories 실패:', err);
    throw new Error('카테고리 목록을 불러오는 중 오류가 발생했습니다.');
  }
};
