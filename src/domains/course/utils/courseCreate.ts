import { createLecture } from '../services/lectureCreateService';
import { createSection } from '../services/sectionCreateService';
import {
  CourseDraftForm,
  CreateCourseRequest,
  CreateLectureRequest,
  LectureDraftForm,
  SectionDraftForm,
} from '../types/course';

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
  const categoryId = Number(draft.category[draft.category.length - 1]);

  return {
    title: draft.title,
    summary: draft.summary,
    description: draft.description,
    categoryId, // number
    price: draft.price,
    courseLevel: draft.level,
  };
};

// 강좌 발행용 - 섹션/강의 데이터 포맷팅 함수
export const formatLectureData = (
  lecDraft: LectureDraftForm,
  lIndex: number,
): CreateLectureRequest => {
  const primary = Array.isArray(lecDraft.resource) ? lecDraft.resource[0] : undefined;

  // 최종 규칙: lecture.resource[0].fileUrl === resourceKey
  const resourceKey = primary?.fileUrl?.trim() ?? '';

  return {
    title: lecDraft.title,
    isPreview: !!lecDraft.isPreview,
    orderIndex: lIndex + 1,
    resourceKey,
  };
};

// 강좌 발행용 - 섹션/강의 초안 적용 함수
export const applySectionDraftsForNewCourse = async (
  courseId: string,
  sectionDrafts: SectionDraftForm[],
): Promise<void> => {
  for (let sIndex = 0; sIndex < sectionDrafts.length; sIndex++) {
    const secDraft = sectionDrafts[sIndex];

    // 섹션 제목 없으면 생성 스킵 (최종 정책에 맞춰 조정 가능)
    if (!secDraft.title.trim()) continue;

    const sectionRes = await createSection(courseId, {
      title: secDraft.title,
      orderIndex: sIndex + 1,
    });

    const sectionId = String(sectionRes.sectionId ?? '');

    for (let lIndex = 0; lIndex < secDraft.lectures.length; lIndex++) {
      const lecDraft = secDraft.lectures[lIndex];

      // 강의 제목 없으면 스킵
      if (!lecDraft.title.trim()) continue;

      const payload = formatLectureData(lecDraft, lIndex);

      // 스펙: resourceKey 유효할 때만 createLecture 가능
      if (!payload.resourceKey) continue;

      await createLecture(courseId, sectionId, payload);
    }
  }
};

// 생성된 강좌조회 용 데이터 매핑 함수
export const mapResponseToCourseDraft = (data: any) => {
  // categoryIds가 배열로 오면 그대로 string 배열로 저장
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
    level: data.courseLevel ?? 'BEGINNER',
    price: data.price ?? 0,
  };

  // SectionDraftForm / LectureDraftForm 필드에 맞춰 최소 매핑
  const sectionDrafts: SectionDraftForm[] = (data.sections ?? []).map((sec: any) => ({
    localId: String(sec.id ?? crypto.randomUUID?.() ?? Date.now()),
    id: String(sec.id ?? ''),
    title: sec.title ?? '',
    _dirty: false,
    _deleted: false,
    lectures: (sec.lectures ?? []).map((lec: any) => ({
      localId: String(lec.id ?? crypto.randomUUID?.() ?? Date.now()),
      id: String(lec.id ?? ''),
      title: lec.title ?? '',
      duration: lec.totalDurationSeconds ?? 0,
      videoUrl: lec.videoUrl ?? '',
      isPreview: !!lec.isPreview,
      resource: Array.isArray(lec.resource) ? lec.resource : lec.resource ? [lec.resource] : [],
      _dirty: false,
      _deleted: false,
    })),
  }));

  return { courseDraft, sectionDrafts };
};
