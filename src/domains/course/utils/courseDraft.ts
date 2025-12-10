import { CourseDraft, CreateSectionRequest, LectureDraft, SectionDraft } from '../types/course';

export const createEmptyLecture = (): LectureDraft => ({
  id:
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : String(Date.now() + Math.random()),
  title: '',
  duration: 0,
  videoUrl: '',
});

export const createEmptySection = (): SectionDraft => ({
  id:
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : String(Date.now() + Math.random()),
  title: '',
  lectures: [createEmptyLecture()],
});

export const buildSectionDraft = (sections: SectionDraft[]): CreateSectionRequest[] =>
  sections.map((section) => ({
    title: section.title,
    lectures: section.lectures.map((lecture) => ({
      title: lecture.title,
      videoUrl: lecture.videoUrl,
      duration: lecture.duration,
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
