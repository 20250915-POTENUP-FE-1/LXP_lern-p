import { createLecture } from '../services/lectureCreateService';
import { createSection } from '../services/sectionCreateService';
import { CourseDraftForm, CreateCourseRequest, SectionDraftForm } from '../types/course';

export const createCourseFormData = (data: any, file?: File) => {
  const formData = new FormData();

  formData.append('request', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  if (file) {
    formData.append('thumbnail', file);
  }
  return formData;
};

// 강좌 생성용 데이터 매핑 함수
export const mapDraftToCreateRequest = (draft: CourseDraftForm): CreateCourseRequest => {
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

// 강좌 발행용 - 섹션/강의 데이터 포맷팅 함수
export const formatLectureData = (lecDraft: any, lIndex: number) => {
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
export const applySectionDraftsForNewCourse = async (
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

// 생성된 강좌조회 용 데이터 매핑 함수
export const mapResponseToCourseDraft = (data: any) => {
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
