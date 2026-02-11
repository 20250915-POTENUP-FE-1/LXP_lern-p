import { CourseDraftForm, CourseLevel, LectureDraftForm, SectionDraftForm } from '../types/course';

// 공통 ID 생성 유틸
const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

export const createEmptyLecture = (): LectureDraftForm => ({
  localId: generateId(),
  id: '',
  title: '',
  duration: 0,
  videoUrl: '',
  isPreview: false,
  resource: [
    {
      resourceType: 'VIDEO', // 기본값은 VIDEO로 시작
      isDownloadable: false,
      fileUrl: '',
    },
  ],
  _dirty: false,
});

export const createEmptySection = (): SectionDraftForm => ({
  localId: generateId(),
  id: '',
  title: '',
  lectures: [createEmptyLecture()],
  _dirty: false,
});

export const buildSectionDraft = (sections: SectionDraftForm[]): SectionDraftForm[] =>
  sections.map((section) => ({
    ...section,
    lectures: section.lectures.map((lecture) => ({
      ...lecture,
      duration: Number(lecture.duration) || 0,
    })),
  }));

export type CourseFormState = {
  title: string;
  summary: string;
  description: string;
  category: string[];
  level: CourseLevel;
  price: number | string | ''; // input 제어용
  thumbnailUrl: string;
  thumbnailResourceKey: string;
};

export const buildCourseDraft = (form: CourseFormState): CourseDraftForm => ({
  title: form.title,
  summary: form.summary,
  description: form.description,
  thumbnail: form.thumbnailUrl,
  category: form.category,
  level: form.level,
  price: form.price === '' ? 0 : Number(form.price),
  thumbnailResourceKey: form.thumbnailResourceKey, // 실제 업로드 후에 설정됨
});
