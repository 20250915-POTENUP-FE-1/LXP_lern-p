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
          orderIndex,
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
        // (1) delete: id string 보장
        if (lecture._deleted && lecture.id) {
          await deleteLecture(courseId, String(lecture.id));
          continue;
        }

        // (2) CreateLectureRequest/UpdateLectureRequest는 resourceKey가 필수
        //     Draft에는 resourceKey가 없으니, 최소한 resource[0].fileUrl을 key처럼 사용(임시)
        //     없으면 요청을 보내지 않고 skip (에러 방지)
        const resourceKey = lecture.resource?.[0]?.fileUrl?.trim();
        const safeOrderIndex = lectureIndex + 1; // orderIndex 통일(1-based)

        // create
        if (!lecture.id && lecture.title.trim()) {
          if (!resourceKey) {
            // resourceKey 없으면 타입/서버 에러 날 수 있으니 생성 스킵
            continue;
          }

          const res = await createLecture(courseId, String(sectionId), {
            title: lecture.title,
            isPreview: lecture.isPreview,
            orderIndex: safeOrderIndex,
            resourceKey,
          });

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

        // update
        if (lecture.id && lecture._dirty) {
          if (!resourceKey) {
            // update도 resourceKey 필수라 가드
            continue;
          }

          await updateLecture(courseId, String(lecture.id), {
            title: lecture.title,
            isPreview: lecture.isPreview,
            orderIndex: safeOrderIndex,
            resourceKey,
          });
        }
      }
    }
  },
}));
