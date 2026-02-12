import { createLecture } from '../services/lectureCreateService';
import { createSection } from '../services/sectionCreateService';
import {
  CourseDraftForm,
  CreateCourseRequest,
  CreateLectureRequest,
  GetDraftCourseResponse,
  LectureDraftForm,
  SectionDraftForm,
} from '../types/course';
import { CourseFormState } from './courseDraft';

export const createCourseFormData = (data: CourseFormState, file?: File) => {
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
    thumbnailResourceKey: draft.thumbnailResourceKey,
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
export const mapResponseToCourseDraft = (data: GetDraftCourseResponse) => {
  const { courseDraft, sectionDrafts } = data;

  const newCourseDraft: CourseDraftForm = {
    title: courseDraft?.title ?? '',
    summary: courseDraft?.summary ?? '',
    description: courseDraft?.description ?? '',
    thumbnail: courseDraft?.thumbnail ?? '',
    thumbnailResourceKey: courseDraft?.thumbnailResourceKey ?? '',
    category: Array.isArray(courseDraft?.category)
      ? courseDraft.category.map((id) => String(id))
      : [],
    level: courseDraft?.level ?? 'BEGINNER',
    price: courseDraft?.price ?? 0,
    status: courseDraft?.status,
  };

  const newSectionDrafts: SectionDraftForm[] = (sectionDrafts ?? []).map((sec) => ({
    localId: sec.localId ?? String(sec.id ?? crypto.randomUUID?.() ?? Date.now()),
    id: String(sec.id ?? ''),
    title: sec.title ?? '',
    _dirty: !!sec._dirty,
    _deleted: !!sec._deleted,
    lectures: (sec.lectures ?? []).map((lec) => ({
      localId: lec.localId ?? String(lec.id ?? crypto.randomUUID?.() ?? Date.now()),
      id: String(lec.id ?? ''),
      title: lec.title ?? '',
      duration: lec.duration ?? 0,
      videoUrl: lec.videoUrl ?? '',
      isPreview: !!lec.isPreview,
      resource: Array.isArray(lec.resource) ? lec.resource : [],
      file: lec.file,
      _dirty: !!lec._dirty,
      _deleted: !!lec._deleted,
    })),
  }));

  return { courseDraft: newCourseDraft, sectionDrafts: newSectionDrafts };
};
