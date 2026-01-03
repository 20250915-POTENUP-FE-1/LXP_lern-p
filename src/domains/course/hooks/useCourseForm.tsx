import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { validateForm } from '@/shared/util/validateForm';
import { buildCourseDraft, type CourseFormState } from '../utils/courseDraft';
import { createDraftCourse } from '../services/courseCreateService';
import type { CourseDraftForm } from '../types/course';

const COURSE_DRAFT_ID_KEY = 'courseDraftId';

export function useCourseForm() {
  const router = useRouter();
  const { user } = useAuthState();
  const params = useParams<{ id?: string }>();
  const searchParams = useSearchParams();
  const entry = searchParams.get('entry');

  const paramsId = typeof params.id === 'string' ? params.id : '';

  const courseId = paramsId;

  const [formData, setFormData] = useState<CourseFormState>({
    title: '',
    summary: '',
    description: '',
    category: [],
    level: '',
    price: '',
    thumbnailUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const isInvalid = validateForm(formData);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const handleThumbnailFileSelect = (file: File | null) => {
    setThumbnailFile(file);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: id === 'price' ? (value === '' ? '' : value) : value,
    }));
  };

  const handleCategoryChange = (category: string[]) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
  };

  const handleThumbnailUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      thumbnailUrl: url,
    }));
  };

  const ensureDraftCreated = async (draftData: CourseDraftForm) => {
    const savedId = sessionStorage.getItem(COURSE_DRAFT_ID_KEY);
    if (savedId) return savedId;

    // 서버에 draft 강좌 생성 → courseId 확보
    const { courseId } = await createDraftCourse(draftData, thumbnailFile ?? undefined);
    sessionStorage.setItem(COURSE_DRAFT_ID_KEY, courseId);
    return courseId;
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    setLoading(true);

    const draftData = buildCourseDraft(formData); // CourseDraftForm

    try {
      try {
        sessionStorage.setItem('courseDraft_step1', JSON.stringify(draftData));
      } catch (err) {
        console.error('세션 저장 실패:', err);
        alert('임시 저장 중 오류가 발생했습니다. 브라우저 설정을 확인해주세요.');
        return;
      }

      // 최초 1회만 임시 강좌 생성
      await ensureDraftCreated(draftData);

      // URL은 create 유지
      goStep2();
      return;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '강좌 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const goStep2 = () => {
    const next = new URLSearchParams();
    next.set('step', '2');
    if (entry) next.set('entry', entry);
    router.push(`/courses/create?${next.toString()}`);
  };

  const handleCancel = () => {
    router.push(entry ? decodeURIComponent(entry) : '/');
  };

  // 카테고리 조회 + 초기 데이터 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // create 모드일 때 기존 draft 복원 로직 (기존 유지)
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    if (from === 'section') {
      const draft = sessionStorage.getItem('courseDraft_step1');
      if (draft) {
        try {
          const raw = JSON.parse(draft) as Partial<CourseDraftForm>;

          const nextForm: CourseFormState = {
            title: raw.title ?? '',
            summary: raw.summary ?? '',
            description: raw.description ?? '',
            category: raw.category ?? [],
            level: raw.level ?? '',
            price: raw.price == null ? '' : String(raw.price),
            thumbnailUrl: raw.thumbnail ?? '',
          };

          setFormData(nextForm);
        } catch (err) {
          console.error('임시 저장된 강좌 기본 정보 파싱 실패:', err);
        }
      }
    } else {
      sessionStorage.removeItem('courseDraft_step1');
      sessionStorage.removeItem('courseDraft_step2');
      sessionStorage.removeItem(COURSE_DRAFT_ID_KEY);
    }
  }, [courseId]);

  return {
    formData,
    loading,
    error,
    success,
    isInvalid,
    handleFormSubmit,
    handleChange,
    handleCategoryChange,
    handleThumbnailUpload,
    handleThumbnailFileSelect,
    handleCancel,
  };
}
