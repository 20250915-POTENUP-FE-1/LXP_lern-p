'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { CourseDraftForm, SectionDraftForm } from '../types/course';
import {
  buildSectionDraft,
  CourseFormState,
  createEmptyLecture,
  createEmptySection,
} from '../utils/courseDraft';
import {
  fetchCourseWithSections,
  updateDraftCourse,
  updateDraftSection,
} from '../services/courseEditService';
import { createDraftCourse, publishDraftCourse } from '../services/courseCreateService';

type SectionFormMode = 'create' | 'edit';

export function useSectionForm() {
  const { user } = useAuthState();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();

  const courseId = typeof params.id === 'string' ? params.id : '';
  const mode: SectionFormMode = pathname?.includes('/edit') ? 'edit' : 'create';

  const [sections, setSections] = useState<SectionDraftForm[]>([createEmptySection()]);
  const [step1Data, setStep1Data] = useState<CourseDraftForm | null>(null);
  const [loading, setLoading] = useState(false); // data fetch/loading gate
  const [submitting, setSubmitting] = useState(false); // final submit loading
  const [drafting, setDrafting] = useState(false); // draft save loading
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const structureInvalid =
    sections.length === 0 ||
    sections.some(
      (section) =>
        !section.title.trim() ||
        section.lectures.length === 0 ||
        section.lectures.some(
          (lecture) => !lecture.title.trim() || !lecture.videoUrl || !lecture.videoUrl.trim(),
        ),
    );
  const isInvalid = structureInvalid;

  const [formData, setFormData] = useState<CourseFormState>({
    title: '',
    summary: '',
    description: '',
    category: [],
    level: '',
    price: '',
    thumbnailUrl: '',
  });
  useEffect(() => {
    const load = async () => {
      if (mode === 'edit') {
        if (!courseId) {
          setError('유효하지 않은 강좌 ID입니다.');
          alert('유효하지 않은 강좌 ID입니다.');
          return;
        }
        setLoading(true);
        try {
          const { courseDraft, sectionDrafts } = await fetchCourseWithSections(courseId);
          setStep1Data(courseDraft);
          setSections(sectionDrafts);
        } catch (err) {
          console.error(err);
          setError(
            err instanceof Error ? err.message : '강좌 데이터를 불러오는 중 오류가 발생했습니다.',
          );
        } finally {
          setLoading(false);
        }
      } else {
        if (typeof window === 'undefined') return;
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
        }
      }
    };

    load();
  }, [mode, courseId, router]);

  const handleSectionAdd = () => {
    setSections((prev) => [...prev, createEmptySection()]);
  };

  const handleSectionDelete = (sectionId: string) => {
    if (!window.confirm('정말 이 섹션을 삭제하시겠습니까?')) return;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const handleLectureAdd = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: [...section.lectures, createEmptyLecture()],
            }
          : section,
      ),
    );
  };

  const handleLectureDelete = (sectionId: string, lectureId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              lectures: section.lectures.filter((lec) => lec.id !== lectureId),
            }
          : section,
      ),
    );
  };

  const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting || drafting) return; // 이미 처리 중이면 중복 실행 방지

    if (!user) {
      // 로그인 검사 추가
      alert('로그인이 필요합니다.');
      return;
    }

    if (isInvalid) {
      alert('섹션과 강의 정보를 모두 입력해주세요.');
      return;
    }

    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      const courseInput = { ...step1Data } as CourseDraftForm;
      const sectionInput = buildSectionDraft(sections); // Step 2 DTO
      let currentDraftId = courseId; // 1. Draft ID 확보: Create Mode이고 ID가 없으면 Step 1 데이터를 기반으로 Draft 생성

      if (mode === 'create' && !currentDraftId) {
        if (!step1Data) throw new Error('강좌 기본 정보가 누락되었습니다.'); // Step 1 데이터만으로 새로운 Draft를 생성하고 ID를 얻습니다.
        currentDraftId = await createDraftCourse(user, courseInput);
      }
      if (!currentDraftId) throw new Error('유효한 강좌 ID를 확보하지 못했습니다.'); // 2. Step 2 데이터 저장/수정 (섹션/강의)

      await updateDraftSection(currentDraftId, sectionInput); // 3. 최종 발행 로직

      if (mode === 'create') {
        // 신규 생성 플로우: 최종적으로 'published' 상태로 변경
        await publishDraftCourse(currentDraftId);
        alert('강좌가 발행 되었습니다');
      } else if (mode === 'edit') {
        // Edit 모드: draft 상태 유지 (status 변경 없음)
        alert('강좌가 임시 저장되었습니다.');
      }

      setSuccess(true);
      sessionStorage.removeItem('courseDraft_step1');
      router.replace('/instructor/courses/');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '강좌 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSectionTitleChange = (sectionId: string, title: string) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, title } : s)));
  };

  const handleLectureTitleChange = (sectionId: string, lectureId: string, title: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lectures: s.lectures.map((l) => (l.id === lectureId ? { ...l, title } : l)),
            }
          : s,
      ),
    );
  };

  const handleLectureUpload = (
    sectionId: string,
    lectureId: string,
    payload: { videoUrl: string; duration: number },
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lectures: s.lectures.map((l) => (l.id === lectureId ? { ...l, ...payload } : l)),
            }
          : s,
      ),
    );
  };
  const handleDraftSave = async () => {
    if (drafting || submitting) return; // 동시 처리 방지

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (isInvalid) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setError('');
    setSuccess(false);
    setDrafting(true);
    try {
      const courseInput = { ...step1Data } as CourseDraftForm;
      const sectionInput = buildSectionDraft(sections);
      let currentDraftId = courseId;

      if (mode === 'create' && !currentDraftId) {
        currentDraftId = await createDraftCourse(user, courseInput);
      } else if (currentDraftId) {
        await updateDraftCourse(currentDraftId, courseInput);
      } else {
        throw new Error('처리할 수 없는 Draft 상태입니다.');
      }

      await updateDraftSection(currentDraftId, sectionInput);
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
    if (mode === 'edit' && courseId) {
      // 임시 수정 후 이전단계
      router.push(`/courses/${courseId}/edit?step=1`);
    } else {
      // 신규 생성 플로우
      router.push('/courses/create?step=1&from=section');
    }
  };

  return {
    user,
    sections,
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
