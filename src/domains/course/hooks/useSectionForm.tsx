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
import { publishCourse, publishDraftCourse } from '../services/courseCreateService';
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

        const resources = lecture.resource ?? [];
        const primaryResource: LectureResource | undefined = Array.isArray(resources)
          ? resources[0]
          : undefined;

        const videoUrl = lecture.videoUrl?.trim();
        const resourceType = primaryResource?.resourceType;
        const fileUrl = primaryResource?.fileUrl?.trim();

        if (resourceType === 'VIDEO') return !videoUrl;

        if (resourceType === 'PDF' || resourceType === 'DOC' || resourceType === 'ZIP') {
          return !fileUrl;
        }

        return true;
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

    updateSectionByLocalId(sectionLocalId, (sec) => ({
      ...sec,
      _deleted: true,
      _dirty: true,
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
        fileUrl: result.fileUrl,
      };

      const nextDuration = isVideo && result.duration != null ? result.duration : lecture.duration;
      const nextVideoUrl = isVideo ? (result.previewUrl ?? result.fileUrl) : lecture.videoUrl;

      return {
        ...lecture,
        duration: nextDuration,
        videoUrl: nextVideoUrl,
        resource: [newResource],
        _file: result.multiFile ?? lecture.file ?? null,
      };
    });
  };

  // === 발행하기: 섹션/강의 생성/수정/삭제 반영 ===
  const syncSectionsAndLectures = async (courseId: string) => {
    for (let sIndex = 0; sIndex < sections.length; sIndex++) {
      const sec = sections[sIndex];

      // 1) 삭제된 섹션 처리
      if (sec._deleted) {
        if (sec.id) await deleteSection(courseId, String(sec.id));
        continue;
      }

      const activeLectures = getActiveLectures(sec);
      const hasContent =
        !!sec.title.trim() &&
        activeLectures.some((lec) => {
          if (!lec.title.trim()) return false;

          const resources = lec.resource ?? [];
          const primaryResource: LectureResource | undefined = Array.isArray(resources)
            ? resources[0]
            : undefined;

          const videoUrl = lec.videoUrl?.trim();
          const resourceType = primaryResource?.resourceType;
          const fileUrl = primaryResource?.fileUrl?.trim();

          if (resourceType === 'VIDEO') return !!videoUrl;
          if (resourceType === 'PDF' || resourceType === 'DOC' || resourceType === 'ZIP')
            return !!fileUrl;

          return false;
        });

      let sectionId = sec.id ? String(sec.id) : undefined;

      // 2) 섹션 생성
      if (!sectionId && hasContent) {
        const created = await createSection(courseId, { title: sec.title, orderIndex: sIndex + 1 });
        sectionId = String(created.sectionId);
      }

      // 3) 섹션 수정
      if (sectionId && sec._dirty) {
        await updateSection(courseId, sectionId, { title: sec.title, orderIndex: sIndex + 1 });
      }

      if (!sectionId) continue;

      // === 강의 처리 ===
      for (let lIndex = 0; lIndex < sec.lectures.length; lIndex++) {
        const lec = sec.lectures[lIndex];

        // 4) 강의 삭제 처리
        if (lec._deleted) {
          if (lec.id) await deleteLecture(courseId, String(lec.id));
          continue;
        }

        const resources = lec.resource ?? [];
        const primaryResource: LectureResource | undefined = Array.isArray(resources)
          ? resources[0]
          : undefined;

        const file = lec.file ?? undefined;
        let lectureId = lec.id ? String(lec.id) : undefined;
        let isJustCreated = false;

        // 5) 새 강의 생성
        if (!lectureId && lec.title.trim()) {
          const createPayload = {
            title: lec.title,
            totalDurationSeconds: lec.duration ?? 0,
            isPreview: lec.isPreview ?? false,
            orderIndex: lIndex + 1,
            resource:
              primaryResource && primaryResource.resourceType
                ? [
                    {
                      resourceType: primaryResource.resourceType,
                      isDownloadable: Boolean(primaryResource.isDownloadable),
                      fileUrl: primaryResource.fileUrl,
                    },
                  ]
                : undefined,
          };

          // TODO: 현재 강의 생성 API 동작 X. 추후 명세 따라 수정 필요
          const created = await createLecture(courseId, sectionId, createPayload, file);
          lectureId = String(created.lectureId ?? created.lectureId);
          isJustCreated = true;
        }

        // 6) 기존 강의 수정
        if (lectureId && lec._dirty && !isJustCreated) {
          // resource 필수 계약이면 여기서 보장/가드
          if (!primaryResource?.resourceType) {
            // 여기로 오면 데이터가 깨진 상태라 실패시키는 게 맞음
            throw new Error('강의 리소스가 누락되어 업데이트할 수 없습니다.');
          }

          const updateResource: LectureResource = {
            resourceType: primaryResource.resourceType,
            isDownloadable: Boolean(primaryResource.isDownloadable),
            fileUrl: primaryResource.fileUrl,
          };

          await updateLecture(courseId, lectureId, {
            title: lec.title,
            isPreview: lec.isPreview ?? false,
            orderIndex: lIndex + 1,
            resource: updateResource,
          });
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

    // 최종적으로도 세션 fallback 한 번 더
    const finalCourseId = courseId || readDraftCourseId();
    if (!finalCourseId) {
      alert('유효한 강좌 ID를 찾을 수 없습니다. 다시 시도해 주세요.');
      return;
    }

    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      // TODO: 현재 강의 생성 API 동작 X. 추후 명세 따라 수정 필요
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

  const handleLectureRemoveResource = (sectionLocalId: string, lectureLocalId: string) => {
    updateLectureByLocalId(sectionLocalId, lectureLocalId, (lec) => {
      const primary = lec.resource?.[0];
      const wasVideo = primary?.resourceType === 'VIDEO';

      return {
        ...lec,
        _dirty: true,
        resource: [] as LectureResource[], // 리소스 제거
        ...(wasVideo ? { videoUrl: '', duration: 0 } : {}), // VIDEO였던 경우 영상 관련도 제거
        file: undefined, // 업로드 파일 제거
        _file: null,
      };
    });
  };

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
    handleLectureAdd,
    handleLectureDelete,
    handleSectionTitleChange,
    handleLectureTitleChange,
    handleLectureUpload,
    handleLectureRemoveResource,
    handleFinalSubmit,
    handlePrevStep,
    handleCancel,
  };
}
