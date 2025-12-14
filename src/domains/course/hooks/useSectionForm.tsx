'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';

import type {
  CourseDraftForm,
  LectureDraftForm,
  LectureResource,
  SectionDraftForm,
} from '../types/course';
import { createEmptyLecture, createEmptySection } from '../utils/courseDraft';
import {
  updateDraftCourse,
  createSection,
  updateSection,
  deleteSection,
  createLecture,
  updateLecture,
  deleteLecture,
  fetchCourseWithSections,
} from '../services/courseEditService';
import { publishDraftCourse } from '../services/courseCreateService';
import type { UploadResult } from '../components/ResourceUploader';

type SectionFormMode = 'create' | 'edit';

type UseSectionFormParams = {
  mode?: SectionFormMode;
  courseId?: string;
};

export function useSectionForm(options?: UseSectionFormParams) {
  const { mode: modeProp, courseId: courseIdProp } = options ?? {};
  const { user } = useAuthState();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();

  // URL 우선, props는 fallback
  const mode: SectionFormMode = pathname?.includes('/edit') ? 'edit' : (modeProp ?? 'create');

  const [sections, setSections] = useState<SectionDraftForm[]>([createEmptySection()]);
  const [step1Data, setStep1Data] = useState<CourseDraftForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // === 유틸: 활성 섹션/강의만 필터링 (삭제 플래그 제외) ===
  const activeSections = sections.filter((sec) => !sec._deleted);
  const getActiveLectures = (sec: SectionDraftForm) => sec.lectures.filter((lec) => !lec._deleted);

  const [resolvedCourseId, setResolvedCourseId] = useState('');

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

    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('draftCourseId');
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
          : (resources as any);

        const videoUrl = lecture.videoUrl?.trim();
        const resourceType = primaryResource?.resourceType;
        const fileUrl = primaryResource?.fileUrl?.trim();

        if (resourceType === 'VIDEO') {
          return !videoUrl;
        }

        if (resourceType === 'PDF' || resourceType === 'DOC' || resourceType === 'ZIP') {
          return !fileUrl;
        }

        // 타입은 있는데 URL도 영상도 없다 → invalid
        return true;
      });
    });

  const isInvalid = structureInvalid;

  // === 초기 로딩 ===
  useEffect(() => {
    if (!courseId) return;
    if (initialized) return;

    const load = async () => {
      // courseId 없는 create 모드 → 세션에서 복원
      if (!courseId) {
        if (mode === 'create') {
          if (typeof window !== 'undefined') {
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

            const savedStep2Data = sessionStorage.getItem('courseDraft_step2');
            if (savedStep2Data) {
              try {
                const parsedSections: SectionDraftForm[] = JSON.parse(savedStep2Data);
                setSections(parsedSections.length > 0 ? parsedSections : [createEmptySection()]);
              } catch (err) {
                console.error('Failed to parse saved step 2 data:', err);
              }
            }
          }
          setInitialized(true);
          return;
        }

        setError('유효하지 않은 강좌 ID입니다.');
        alert('유효하지 않은 강좌 ID입니다.');
        return;
      }

      // edit 모드 + 유효한 courseId → 백엔드에서 강좌 + 섹션/강의 조회
      setLoading(true);
      try {
        const { courseDraft, sectionDrafts } = await fetchCourseWithSections(courseId);
        setStep1Data(courseDraft);
        setSections(sectionDrafts.length > 0 ? sectionDrafts : [createEmptySection()]);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : '강좌 데이터를 불러오는 중 오류가 발생했습니다.',
        );
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    load();
  }, [mode, courseId, router, initialized]);

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

      const nextVideoUrl = isVideo ? result.fileUrl : lecture.videoUrl;

      return {
        ...lecture,
        duration: nextDuration,
        videoUrl: nextVideoUrl,
        resource: [newResource],
        // 파일이 전달된 경우에만 덮어쓰고, 없으면 기존 값을 유지
        _file: (result as any).file ?? (lecture as any)._file ?? null,
      };
    });
  };

  // === 최종 싱크 로직 (추가/수정/삭제 한번에) ===
  const syncSectionsAndLectures = async (courseId: string) => {
    for (let sIndex = 0; sIndex < sections.length; sIndex++) {
      const sec = sections[sIndex];

      // 1) 삭제된 섹션
      if (sec._deleted) {
        if (sec.id) {
          await deleteSection(courseId, String(sec.id));
        }
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
            : (resources as any);

          const videoUrl = lec.videoUrl?.trim();
          const resourceType = primaryResource?.resourceType;
          const fileUrl = primaryResource?.fileUrl?.trim();

          if (resourceType === 'VIDEO') return !!videoUrl;
          if (resourceType === 'PDF' || resourceType === 'DOC' || resourceType === 'ZIP')
            return !!fileUrl;

          return false;
        });

      let sectionId = sec.id ? String(sec.id) : undefined;

      // 2) id 없음 + 내용 있음 → 섹션 생성
      if (!sectionId && hasContent) {
        const created = await createSection(courseId, {
          title: sec.title,
          orderIndex: sIndex + 1,
        });

        sectionId = String(created.sectionId);
      }

      // 3) id 있고 _dirty → 섹션 수정
      if (sectionId && sec._dirty) {
        await updateSection(courseId, sectionId, {
          title: sec.title,
          orderIndex: sIndex + 1,
        });
      }

      if (!sectionId) {
        // 내용도 없고 생성도 안 된 섹션은 스킵
        continue;
      }

      // === 강의 처리 ===
      for (let lIndex = 0; lIndex < sec.lectures.length; lIndex++) {
        const lec = sec.lectures[lIndex];

        // 삭제된 강의
        if (lec._deleted) {
          if (lec.id) {
            await deleteLecture(courseId, String(lec.id));
          }
          continue;
        }

        const resources = lec.resource ?? [];
        const primaryResource: LectureResource | undefined = Array.isArray(resources)
          ? resources[0]
          : (resources as any);

        const hasLectureContent = (() => {
          if (!lec.title.trim()) return false;

          const videoUrl = lec.videoUrl?.trim();
          const resourceType = primaryResource?.resourceType;
          const fileUrl = primaryResource?.fileUrl?.trim();

          if (resourceType === 'VIDEO') return !!videoUrl;
          if (resourceType === 'PDF' || resourceType === 'DOC' || resourceType === 'ZIP')
            return !!fileUrl;

          return false;
        })();

        let lectureId = lec.id ? String(lec.id) : undefined;
        const file = (lec as any)._file ?? undefined;
        // 새 강의 생성
        if (!lectureId && hasLectureContent) {
          const resourcePayload =
            primaryResource && primaryResource.resourceType
              ? [
                  {
                    resourceType: primaryResource.resourceType,
                    isDownloadable: Boolean(primaryResource.isDownloadable),
                    fileUrl: primaryResource.fileUrl,
                  },
                ]
              : undefined;

          const created = await createLecture(
            courseId,
            sectionId,
            {
              title: lec.title,
              totalDurationSeconds: lec.duration ?? 0,
              isPreview: lec.isPreview ?? false,
              orderIndex: lIndex + 1,
              resource: resourcePayload,
            },
            file,
          );

          lectureId = String(created.lectureId);
        }

        // 기존 강의 수정
        if (lectureId && lec._dirty) {
          const resourcePayload =
            primaryResource && primaryResource.resourceType
              ? [
                  {
                    resourceType: primaryResource.resourceType,
                    isDownloadable: Boolean(primaryResource.isDownloadable),
                    fileUrl: primaryResource.fileUrl,
                  },
                ]
              : undefined;

          await updateLecture(courseId, lectureId, {
            title: lec.title,
            totalDurationSeconds: lec.duration ?? 0,
            isPreview: lec.isPreview ?? false,
            orderIndex: lIndex + 1,
            resource: resourcePayload,
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

    if (!courseId) {
      alert('유효한 강좌 ID를 찾을 수 없습니다. 다시 시도해 주세요.');
      return;
    }

    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      // 1) 섹션/강의 생성/수정/삭제 한 번에 반영
      await syncSectionsAndLectures(courseId);

      // 2) 강좌 발행
      await publishDraftCourse(courseId);

      alert('강좌가 발행되었습니다.');
      setSuccess(true);
      sessionStorage.removeItem('courseDraft_step1');
      sessionStorage.removeItem('courseDraft_step2');

      router.replace(`/courses/${courseId}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '강좌 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // === Step2 임시저장 (초기 설계 유지: Step1/Step2 둘 다 세션 유지) ===
  const handleDraftSave = async () => {
    if (submitting) return;

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!courseId || !step1Data) {
      alert('강좌 기본 정보가 누락되었습니다.');
      return;
    }

    setError('');
    setSuccess(false);
    setDrafting(true);
    try {
      await updateDraftCourse(courseId, step1Data);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('courseDraft_step2', JSON.stringify(sections));
      }
      alert('임시 저장되었습니다.');
      setSuccess(true);
      router.replace('/instructor/courses/');
    } catch (err) {
      console.error('데이터 저장 실패:', err);
      setError(err instanceof Error ? err.message : '임시 저장 중 오류가 발생했습니다.');
    } finally {
      setDrafting(false);
    }
  };

  const handlePrevStep = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('courseDraft_step2', JSON.stringify(sections));
    }

    if (mode === 'edit' && courseId) {
      router.push(`/courses/${courseId}/edit?step=1`);
    } else {
      router.push('/courses/create?step=1&from=section');
    }
  };

  // create 모드에서 자동 세션 저장
  useEffect(() => {
    if (mode !== 'create') return;
    if (!initialized) return;
    if (typeof window === 'undefined') return;

    sessionStorage.setItem('courseDraft_step2', JSON.stringify(sections));
  }, [sections, mode, initialized]);

  return {
    user,
    sections: activeSections, // 삭제된 건 UI에서 숨김
    step1Data,
    loading,
    submitting,
    drafting,
    error,
    success,
    isInvalid,
    handleDraftSave,
    handleSectionAdd,
    handleSectionDelete,
    handleLectureAdd,
    handleLectureDelete,
    handleSectionTitleChange,
    handleLectureTitleChange,
    handleLectureUpload,
    handleFinalSubmit,
    handlePrevStep,
  };
}
