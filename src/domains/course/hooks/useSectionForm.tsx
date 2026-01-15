'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import type {
  CourseDraftForm,
  SectionDraftForm,
  LectureDraftForm,
  LectureResource,
} from '../types/course';
import { createEmptyLecture, createEmptySection } from '../utils/courseDraft';
import { publishCourse } from '../services/courseCreateService';
import type { UploadResult } from '../components/ResourceUploader';
import { deleteLecture, createLecture, updateLecture } from '../services/lectureCreateService';
import { deleteSection, createSection, updateSection } from '../services/sectionCreateService';

type UseSectionFormParams = {
  courseId?: string;
};

const COURSE_DRAFT_ID_KEY = 'courseDraftId';

const readDraftCourseId = () => {
  if (typeof window === 'undefined') return '';
  return sessionStorage.getItem(COURSE_DRAFT_ID_KEY) ?? '';
};

export function useSectionForm(options?: UseSectionFormParams) {
  const { courseId: courseIdProp } = options ?? {};
  const { user } = useAuthState();
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const entry = searchParams.get('entry');

  const [sections, setSections] = useState<SectionDraftForm[]>([createEmptySection()]);
  const [step1Data, setStep1Data] = useState<CourseDraftForm | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [drafting, setDrafting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // courseId는 "초기값"부터 sessionStorage fallback
  const [resolvedCourseId, setResolvedCourseId] = useState<string>(() => readDraftCourseId());

  // === 유틸: 활성 섹션/강의만 필터링 (삭제 플래그 제외) ===
  const activeSections = sections.filter((sec) => !sec._deleted);
  const getActiveLectures = (sec: SectionDraftForm) => sec.lectures.filter((lec) => !lec._deleted);

  // === 인덱스 헬퍼 (sections 선언 이후에 있어야 함) ===
  const findSectionIndexByLocalId = (sectionLocalId: string) =>
    sections.findIndex((s) => s.localId === sectionLocalId);

  const findLectureIndexByLocalId = (sec: SectionDraftForm, lectureLocalId: string) =>
    sec.lectures.findIndex((l) => l.localId === lectureLocalId);

  // URL/props 우선, 없으면 sessionStorage
  useEffect(() => {
    const idFromUrl = typeof params.id === 'string' ? params.id : '';
    if (idFromUrl) {
      setResolvedCourseId(idFromUrl);
      return;
    }

    if (courseIdProp) {
      setResolvedCourseId(courseIdProp);
      return;
    }

    // 아직도 비어있으면 세션에서 한 번 더
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(COURSE_DRAFT_ID_KEY) ?? '';
      if (saved) setResolvedCourseId(saved);
    }
  }, [params.id, courseIdProp]);

  const courseId = resolvedCourseId;

  // === 구조 검증 ===
  const structureInvalid =
    activeSections.length === 0 ||
    activeSections.some((section) => {
      if (!section.title.trim()) return true;

      const activeLectures = getActiveLectures(section);
      if (activeLectures.length === 0) return true;

      return activeLectures.some((lecture) => {
        if (!lecture.title.trim()) return true;

        const primary: LectureResource | undefined = Array.isArray(lecture.resource)
          ? lecture.resource[0]
          : undefined;

        const resourceType = primary?.resourceType;
        const resourceKey = primary?.fileUrl?.trim(); // 여기엔 key(resourceKey)가 저장돼야 함

        if (!resourceType) return true;
        if (!resourceKey) return true;

        return false;
      });
    });

  const isInvalid = structureInvalid;

  // 초기 로딩: courseId 여부와 상관없이 step1/step2 복원 + courseId 확보
  useEffect(() => {
    if (initialized) return;

    const load = async () => {
      if (typeof window === 'undefined') {
        setInitialized(true);
        return;
      }

      // step1 복원
      const savedStep1Data = sessionStorage.getItem('courseDraft_step1');
      if (!savedStep1Data) {
        alert('강좌 기본 정보가 누락되었습니다. 다시 입력해 주세요.');
        router.replace('/courses/create?step=1');
        return;
      }
      try {
        const parsed: CourseDraftForm = JSON.parse(savedStep1Data);
        setStep1Data(parsed);
      } catch (err) {
        console.error('Failed to parse saved step 1 data:', err);
        router.replace('/courses/create?step=1');
        return;
      }

      // step2 복원
      const savedStep2Data = sessionStorage.getItem('courseDraft_step2');
      if (savedStep2Data) {
        try {
          const parsedSections: SectionDraftForm[] = JSON.parse(savedStep2Data);
          setSections(parsedSections.length > 0 ? parsedSections : [createEmptySection()]);
        } catch (err) {
          console.error('Failed to parse saved step 2 data:', err);
        }
      }

      // courseId 확보 (state → session)
      const savedId = sessionStorage.getItem(COURSE_DRAFT_ID_KEY) ?? '';
      const finalId = courseId || savedId;

      if (!finalId) {
        alert('유효한 강좌 ID를 찾을 수 없습니다. 다시 시도해 주세요.');
        router.replace('/courses/create?step=1');
        return;
      }

      if (finalId !== courseId) setResolvedCourseId(finalId);

      setInitialized(true);
    };

    load();
  }, [initialized, router, courseId]);

  // === 공통 헬퍼: 섹션/강의 업데이트 ===
  const updateSectionByLocalId = (
    sectionLocalId: string,
    updater: (sec: SectionDraftForm) => SectionDraftForm,
  ) => {
    setSections((prev) => prev.map((sec) => (sec.localId === sectionLocalId ? updater(sec) : sec)));
  };

  const updateLectureByLocalId = (
    sectionLocalId: string,
    lectureLocalId: string,
    updater: (lec: LectureDraftForm) => LectureDraftForm,
  ) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.localId === sectionLocalId
          ? {
              ...sec,
              _dirty: true,
              lectures: sec.lectures.map((lec) =>
                lec.localId === lectureLocalId ? updater({ ...lec, _dirty: true }) : lec,
              ),
            }
          : sec,
      ),
    );
  };

  // === 섹션/강의 조작 핸들러들 (로컬 상태만) ===
  const handleSectionAdd = () => {
    setSections((prev) => [...prev, createEmptySection()]);
  };

  const handleSectionDelete = (sectionLocalId: string) => {
    if (!window.confirm('정말 이 섹션을 삭제하시겠습니까?')) return;

    // 섹션 삭제 시 하위 강의도 함께 삭제 플래그 전파
    updateSectionByLocalId(sectionLocalId, (sec) => ({
      ...sec,
      _deleted: true,
      _dirty: true,
      lectures: sec.lectures.map((lec) => ({
        ...lec,
        _deleted: true,
        _dirty: true,
      })),
    }));
  };

  const handleSectionTitleChange = (sectionLocalId: string, title: string) => {
    updateSectionByLocalId(sectionLocalId, (sec) => ({
      ...sec,
      title,
      _dirty: true,
    }));
  };

  const handleLectureAdd = (sectionLocalId: string) => {
    updateSectionByLocalId(sectionLocalId, (sec) => ({
      ...sec,
      _dirty: true,
      lectures: [...sec.lectures, createEmptyLecture()],
    }));
  };

  const handleLectureDelete = (sectionLocalId: string, lectureLocalId: string) => {
    if (!window.confirm('정말 이 강의를 삭제하시겠습니까?')) return;

    updateLectureByLocalId(sectionLocalId, lectureLocalId, (lec) => ({
      ...lec,
      _deleted: true,
    }));
  };

  const handleLectureTitleChange = (
    sectionLocalId: string,
    lectureLocalId: string,
    title: string,
  ) => {
    updateLectureByLocalId(sectionLocalId, lectureLocalId, (lec) => ({
      ...lec,
      title,
    }));
  };

  const handleSectionTitleBlur = async (sectionLocalId: string) => {
    if (!courseId) return;

    const sIndex = findSectionIndexByLocalId(sectionLocalId);
    if (sIndex < 0) return;

    const sec = sections[sIndex];
    if (sec._deleted) return;

    const title = sec.title.trim();
    if (!title) return;

    const orderIndex = sIndex + 1;

    try {
      setDrafting(true);

      // create
      if (!sec.id) {
        const created = await createSection(courseId, { title, orderIndex });

        updateSectionByLocalId(sectionLocalId, (prev) => ({
          ...prev,
          id: String(created.sectionId),
          _dirty: false,
        }));
        return;
      }

      // update
      if (sec._dirty) {
        await updateSection(courseId, String(sec.id), { title, orderIndex });

        updateSectionByLocalId(sectionLocalId, (prev) => ({
          ...prev,
          _dirty: false,
        }));
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '섹션 저장 중 오류가 발생했습니다.');
    } finally {
      setDrafting(false);
    }
  };

  // === onBlur: 강의 자동 저장 ===
  const handleLectureTitleBlur = async (sectionLocalId: string, lectureLocalId: string) => {
    if (!courseId) return;

    const sIndex = findSectionIndexByLocalId(sectionLocalId);
    if (sIndex < 0) return;

    const sec = sections[sIndex];
    if (sec._deleted) return;
    if (!sec.id) return; // section.id 없으면 강의 저장 불가

    const lIndex = findLectureIndexByLocalId(sec, lectureLocalId);
    if (lIndex < 0) return;

    const lec = sec.lectures[lIndex];
    if (lec._deleted) return;

    const title = lec.title.trim();
    if (!title) return;

    const primary = Array.isArray(lec.resource) ? lec.resource[0] : undefined;
    const resourceKey = primary?.fileUrl?.trim() ?? '';
    if (!resourceKey) return;

    const orderIndex = lIndex + 1;

    try {
      setDrafting(true);

      // create
      if (!lec.id) {
        const created = await createLecture(courseId, String(sec.id), {
          title,
          isPreview: !!lec.isPreview,
          orderIndex,
          resourceKey,
        });

        updateLectureByLocalId(sectionLocalId, lectureLocalId, (prev) => ({
          ...prev,
          id: String(created.lectureId),
          _dirty: false,
        }));
        return;
      }

      // update
      if (lec._dirty) {
        await updateLecture(courseId, String(lec.id), {
          title,
          isPreview: !!lec.isPreview,
          orderIndex,
          resourceKey,
        });

        updateLectureByLocalId(sectionLocalId, lectureLocalId, (prev) => ({
          ...prev,
          _dirty: false,
        }));
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '강의 저장 중 오류가 발생했습니다.');
    } finally {
      setDrafting(false);
    }
  };

  const handleLectureUpload = async (
    sectionLocalId: string,
    lectureLocalId: string,
    result: UploadResult,
  ) => {
    updateLectureByLocalId(sectionLocalId, lectureLocalId, (lecture) => {
      const isVideo = result.resourceType === 'VIDEO';

      const newResource: LectureResource = {
        resourceType: result.resourceType,
        isDownloadable: isVideo ? false : result.isDownloadable,
        fileUrl: result.resourceKey,
      };
      const nextDuration =
        isVideo && result.duration != null ? Number(result.duration) : lecture.duration;

      const nextVideoUrl = isVideo ? (result.previewUrl ?? lecture.videoUrl) : lecture.videoUrl;

      return {
        ...lecture,
        duration: nextDuration,
        videoUrl: nextVideoUrl,
        resource: [newResource],
        _file: result.multiFile ?? lecture.file ?? null,
      };
    });
    await handleLectureTitleBlur(sectionLocalId, lectureLocalId);
  };

  // === 리소스 제거 ===
  const handleLectureRemoveResource = (sectionLocalId: string, lectureLocalId: string) => {
    updateLectureByLocalId(sectionLocalId, lectureLocalId, (lec) => {
      const primary = Array.isArray(lec.resource) ? lec.resource[0] : undefined;
      const wasVideo = primary?.resourceType === 'VIDEO';

      return {
        ...lec,
        _dirty: true,
        resource: [] as LectureResource[],
        ...(wasVideo ? { videoUrl: '', duration: 0 } : {}),
        file: undefined,
        _file: null,
      };
    });
  };
  const syncSectionsAndLectures = async (courseId: string) => {
    // 1) 섹션 delete
    for (const sec of sections) {
      if (!sec._deleted) continue;
      if (sec.id) await deleteSection(courseId, String(sec.id));
    }

    // 2) 섹션 create/update
    for (let sIndex = 0; sIndex < sections.length; sIndex++) {
      const sec = sections[sIndex];
      if (sec._deleted) continue;

      const title = sec.title.trim();
      if (!title) continue;

      const orderIndex = sIndex + 1;

      // create: id 없음 && title 유효
      if (!sec.id) {
        const created = await createSection(courseId, { title, orderIndex });

        // 로컬 반영
        const newSectionId = String(created.sectionId);
        updateSectionByLocalId(sec.localId, (prev) => ({
          ...prev,
          id: newSectionId,
          _dirty: false,
        }));
        // 이후 강의 처리에 필요하므로 sec.id를 즉시 반영된 값으로 사용하기 위해 로컬 변수로도 유지
        sec.id = newSectionId;
      } else if (sec._dirty) {
        // update: id 있음 && _dirty
        await updateSection(courseId, String(sec.id), { title, orderIndex });
        updateSectionByLocalId(sec.localId, (prev) => ({ ...prev, _dirty: false }));
      }
    }

    // 3) 강의 delete
    for (const sec of sections) {
      for (const lec of sec.lectures) {
        if (!lec._deleted) continue;
        if (lec.id) await deleteLecture(courseId, String(lec.id));
      }
    }

    // 4) 강의 create/update
    for (const sec of sections) {
      if (sec._deleted) continue;
      if (!sec.id) continue;

      for (let lIndex = 0; lIndex < sec.lectures.length; lIndex++) {
        const lec = sec.lectures[lIndex];
        if (lec._deleted) continue;

        const title = lec.title.trim();
        if (!title) continue;

        const primary = Array.isArray(lec.resource) ? lec.resource[0] : undefined;
        const resourceKey = primary?.fileUrl?.trim() ?? '';
        if (!resourceKey) continue;
        if (resourceKey.startsWith('tmp/')) continue;

        const orderIndex = lIndex + 1;

        // create
        if (!lec.id) {
          const created = await createLecture(courseId, String(sec.id), {
            title,
            isPreview: !!lec.isPreview,
            orderIndex,
            resourceKey,
          });

          updateLectureByLocalId(sec.localId, lec.localId, (prev) => ({
            ...prev,
            id: String(created.lectureId),
            _dirty: false,
          }));
          continue;
        }

        // update
        if (lec._dirty) {
          await updateLecture(courseId, String(lec.id), {
            title,
            isPreview: !!lec.isPreview,
            orderIndex,
            resourceKey,
          });

          updateLectureByLocalId(sec.localId, lec.localId, (prev) => ({
            ...prev,
            _dirty: false,
          }));
        }
      }
    }
  };
  // === 최종 등록 버튼 ===
  const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting || drafting) return;

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (isInvalid) {
      alert('섹션과 강의 정보를 모두 입력해주세요.');
      return;
    }
    const hasTmpKey = sections.some((sec) => {
      if (sec._deleted) return false;

      return sec.lectures.some((lec) => {
        if (lec._deleted) return false;
        const key = lec.resource?.[0]?.fileUrl?.trim() ?? '';
        return key.startsWith('tmp/');
      });
    });
    if (hasTmpKey) {
      alert(
        '파일 업로드가 아직 연동되지 않아 임시 키(tmp/) 상태입니다. 업로드 연동 후 등록할 수 있습니다.',
      );
      return;
    }

    const finalCourseId = courseId || readDraftCourseId();
    if (!finalCourseId) {
      alert('유효한 강좌 ID를 찾을 수 없습니다. 다시 시도해 주세요.');
      return;
    }

    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      await syncSectionsAndLectures(finalCourseId);
      await publishCourse(finalCourseId);

      alert('강좌가 발행되었습니다.');
      setSuccess(true);

      sessionStorage.removeItem('courseDraft_step1');
      sessionStorage.removeItem('courseDraft_step2');
      sessionStorage.removeItem(COURSE_DRAFT_ID_KEY);

      router.replace(`/courses/${finalCourseId}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '강좌 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrevStep = () => {
    const params = new URLSearchParams();
    params.set('step', '1');
    if (entry) params.set('entry', entry);
    router.push(`/courses/create?${params.toString()}&from=section`);
  };

  const handleCancel = () => {
    router.push(entry ? decodeURIComponent(entry) : '/');
  };

  // create 모드에서 자동 세션 저장
  useEffect(() => {
    if (!initialized) return;
    if (typeof window === 'undefined') return;

    sessionStorage.setItem('courseDraft_step2', JSON.stringify(sections));
  }, [sections, initialized]);

  useEffect(() => {
    if (!initialized) return;

    const reasons: string[] = [];
    const activeSecs = sections.filter((s) => !s._deleted);

    if (activeSecs.length === 0) reasons.push('활성 섹션 0개');

    activeSecs.forEach((sec, si) => {
      if (!sec.title.trim()) reasons.push(`섹션${si + 1}: 제목 없음`);

      const activeLecs = sec.lectures.filter((l) => !l._deleted);
      if (activeLecs.length === 0) reasons.push(`섹션${si + 1}: 활성 강의 0개`);

      activeLecs.forEach((lec, li) => {
        if (!lec.title.trim()) reasons.push(`섹션${si + 1}-강의${li + 1}: 제목 없음`);

        const primary = Array.isArray(lec.resource) ? lec.resource[0] : undefined;
        if (!primary) reasons.push(`섹션${si + 1}-강의${li + 1}: 리소스 없음`);

        const rt = primary?.resourceType;
        const rk = primary?.fileUrl?.trim();
      });
    });

    console.log('isInvalid:', reasons.length > 0, reasons);
  }, [sections, initialized]);

  return {
    user,
    sections: activeSections,
    step1Data,
    loading,
    submitting,
    drafting,
    error,
    success,
    isInvalid,
    handleSectionAdd,
    handleSectionDelete,
    handleSectionTitleChange,
    handleSectionTitleBlur,
    handleLectureAdd,
    handleLectureDelete,
    handleLectureTitleChange,
    handleLectureTitleBlur,
    handleLectureUpload,
    handleLectureRemoveResource,
    handleFinalSubmit,
    handlePrevStep,
    handleCancel,
  };
}
