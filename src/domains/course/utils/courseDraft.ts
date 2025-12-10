import { CourseDraft, CreateSectionRequest, LectureDraft, SectionDraft } from '../types/course';

// 공통 ID 생성 유틸
const generateId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

export const createEmptyLecture = (): LectureDraft => ({
  id: generateId(),
  title: '',
  duration: 0,
  videoUrl: '',
  isPreview: false,
  resource: {
    resourceType: 'VIDEO',
    isDownloadable: false,
    fileUrl: '',
  },
});

export const createEmptySection = (): SectionDraft => ({
  id: generateId(),
  title: '',
  lectures: [createEmptyLecture()],
});

export const buildSectionDraft = (sections: SectionDraft[]): SectionDraft[] =>
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
  level: string;
  price: number | string | ''; // input 제어용
  thumbnailUrl: string;
};

export const buildCourseDraft = (form: CourseFormState): CourseDraft => ({
  title: form.title,
  summary: form.summary,
  description: form.description,
  thumbnailUrl: form.thumbnailUrl,
  category: form.category,
  level: form.level,
  price: Number(form.price || 0),
});
