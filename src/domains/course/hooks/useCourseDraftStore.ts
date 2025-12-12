import { create } from 'zustand';
import { CourseDraftForm, SectionDraftForm, LectureDraftForm } from '../types/course';
import { createEmptySection, createEmptyLecture } from '../utils/courseDraft';
import { createSection, updateSection, deleteSection } from '../services/sectionService';
import { createLecture, updateLecture, deleteLecture } from '../services/lectureService';

type CourseDraftStore = {
  courseId?: string;
  course?: CourseDraftForm;
  sections: SectionDraftForm[];

  initCourse: (course: CourseDraftForm, courseId: string) => void;

  addSection: () => void;
  updateSectionTitle: (localId: string, title: string) => void;
  deleteSection: (localId: string) => void;

  addLecture: (sectionLocalId: string) => void;
  updateLecture: (
    sectionLocalId: string,
    lectureLocalId: string,
    partial: Partial<LectureDraftForm>,
  ) => void;
  deleteLecture: (sectionLocalId: string, lectureLocalId: string) => void;

  finalSync: () => Promise<void>;
};

export const useCourseDraftStore = create<CourseDraftStore>((set, get) => ({
  sections: [],

  initCourse: (course, courseId) => set({ course, courseId, sections: [createEmptySection()] }),

  // ===== Section =====
  addSection: () => set((s) => ({ sections: [...s.sections, createEmptySection()] })),

  updateSectionTitle: (localId, title) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec.localId === localId ? { ...sec, title, _dirty: true } : sec,
      ),
    })),

  deleteSection: (localId) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec.localId === localId ? { ...sec, _deleted: true } : sec,
      ),
    })),

  // ===== Lecture =====
  addLecture: (sectionLocalId) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec.localId === sectionLocalId
          ? { ...sec, lectures: [...sec.lectures, createEmptyLecture()] }
          : sec,
      ),
    })),

  updateLecture: (sid, lid, partial) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec.localId === sid
          ? {
              ...sec,
              lectures: sec.lectures.map((l) =>
                l.localId === lid ? { ...l, ...partial, _dirty: true } : l,
              ),
            }
          : sec,
      ),
    })),

  deleteLecture: (sid, lid) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec.localId === sid
          ? {
              ...sec,
              lectures: sec.lectures.map((l) => (l.localId === lid ? { ...l, _deleted: true } : l)),
            }
          : sec,
      ),
    })),

  // ===== 최종 싱크 =====
  finalSync: async () => {
    const { courseId, sections } = get();
    if (!courseId) throw new Error('courseId 없음');

    for (const [sectionIndex, section] of sections.entries()) {
      if (section._deleted && section.id) {
        await deleteSection(section.id);
        continue;
      }

      let sectionId = section.id;

      if (!sectionId && section.title.trim()) {
        const res = await createSection(courseId, {
          title: section.title,
          orderIndex: sectionIndex,
        });
        sectionId = String(res.sectionId);
      }

      if (sectionId && section._dirty) {
        await updateSection(sectionId, {
          title: section.title,
          orderIndex: sectionIndex,
        });
      }

      for (const [lectureIndex, lecture] of section.lectures.entries()) {
        if (lecture._deleted && lecture.id) {
          await deleteLecture(lecture.id);
          continue;
        }

        if (!lecture.id && lecture.title.trim()) {
          const res = await createLecture(sectionId!, {
            title: lecture.title,
            totalDurationSeconds: lecture.duration,
            isPreview: lecture.isPreview,
            orderIndex: lectureIndex,
            resource: lecture.resource[0],
          });
          lecture.id = String(res.lectureId);
        }

        if (lecture.id && lecture._dirty) {
          await updateLecture(lecture.id, {
            title: lecture.title,
            totalDurationSeconds: lecture.duration,
            isPreview: lecture.isPreview,
            resource: lecture.resource[0],
          });
        }
      }
    }
  },
}));
