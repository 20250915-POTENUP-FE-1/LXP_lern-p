import { create } from 'zustand';
import { CourseDraftForm, SectionDraftForm, LectureDraftForm } from '../types/course';
import { createEmptySection, createEmptyLecture } from '../utils/courseDraft';
import { createSection, updateSection } from '../services/sectionCreateService';
import { createLecture, updateLecture, deleteLecture } from '../services/lectureCreateService';

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

    const activeSections = sections.filter((s) => !s._deleted);

    for (let sectionIndex = 0; sectionIndex < activeSections.length; sectionIndex++) {
      const section = activeSections[sectionIndex];
      const orderIndex = sectionIndex + 1;

      let sectionId = section.id;

      if (!sectionId && section.title.trim()) {
        const res = await createSection(courseId, {
          title: section.title,
          orderIndex: sectionIndex + 1,
        });
        sectionId = res.sectionId;
        set((s) => ({
          sections: s.sections.map((sec) =>
            sec.localId !== section.localId ? sec : { ...sec, id: res.sectionId },
          ),
        }));
      }

      if (!sectionId) continue;

      if (sectionId && section._dirty) {
        await updateSection(courseId, sectionId, {
          title: section.title,
          orderIndex,
        });
      }

      for (const [lectureIndex, lecture] of section.lectures.entries()) {
        if (lecture._deleted && lecture.id) {
          await deleteLecture(courseId, lecture.id);
          continue;
        }

        if (!lecture.id && lecture.title.trim()) {
          const res = await createLecture(
            courseId,
            sectionId,
            {
              title: lecture.title,
              totalDurationSeconds: lecture.duration,
              isPreview: lecture.isPreview,
              orderIndex: lectureIndex,
              resource: lecture.resource?.length
                ? lecture.resource.map((r) => ({
                    resourceType: r.resourceType as 'VIDEO' | 'PDF' | 'DOC' | 'ZIP',
                    isDownloadable: Boolean(r.isDownloadable), // 불리언 값 보장
                    fileUrl: r.fileUrl,
                  }))
                : undefined,
            },
            lecture.file,
          );

          const createdLectureId = res.lectureId;
          set((s) => ({
            sections: s.sections.map((sec) =>
              sec.localId !== section.localId
                ? sec
                : {
                    ...sec,
                    lectures: sec.lectures.map((l) =>
                      l.localId !== lecture.localId ? l : { ...l, id: createdLectureId },
                    ),
                  },
            ),
          }));
          continue;
        }

        if (lecture.id && lecture._dirty) {
          await updateLecture(courseId, lecture.id, {
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
