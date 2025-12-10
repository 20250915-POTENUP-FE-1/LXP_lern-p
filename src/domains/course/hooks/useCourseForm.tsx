import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { validateForm } from '@/shared/util/validateForm';

import { buildCourseDraft, type CourseFormState } from '../utils/courseDraft';
import { fetchCourseData, updateDraftCourse } from '../services/courseEditService';

type CourseFormMode = 'create' | 'edit';

export function useCourseForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthState();
  const params = useParams<{ id?: string }>();

  const courseId = typeof params.id === 'string' ? params.id : '';
  const mode: CourseFormMode = pathname?.includes('/edit') ? 'edit' : 'create';
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
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: id === 'price' ? (value === '' ? '' : Number(value)) : value,
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

    const dataToStore = buildCourseDraft(formData);

    if (mode === 'create') {
      try {
        sessionStorage.setItem('courseDraft_step1', JSON.stringify(dataToStore));
      } catch (err) {
        console.error('데이터 저장 실패:', err);
        alert('강좌 기본 정보 임시 저장 중 오류가 발생했습니다. 브라우저 설정을 확인해주세요.');
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === 'edit' && courseId) {
        await updateDraftCourse(courseId, dataToStore);
        router.push(`/courses/${courseId}/edit?step=2`);
      } else if (mode === 'create') {
        sessionStorage.setItem('courseDraft_step1', JSON.stringify(dataToStore));
        router.push(`${pathname}?step=2`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '강좌 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (mode === 'edit' && courseId) {
      const loadCourseData = async () => {
        setLoading(true);
        try {
          const data = await fetchCourseData(courseId);
          setFormData({
            ...data,
            price: data.price.toString(),
          } as CourseFormState);
        } catch (err) {
          setError('강좌 정보를 불러오는데 실패했습니다.');
          console.error('Edit Mode 로드 실패:', err);
        } finally {
          setLoading(false);
        }
      };
      loadCourseData();
      return;
    }

    if (mode === 'create') {
      const params = new URLSearchParams(window.location.search);
      const from = params.get('from');
      if (from === 'section') {
        const draft = sessionStorage.getItem('courseDraft_step1');
        if (draft) {
          try {
            setFormData(JSON.parse(draft));
          } catch (err) {
            console.error('임시 저장된 강좌 기본 정보 파싱 실패:', err);
          }
        }
      } else {
        sessionStorage.removeItem('courseDraft_step1');
      }
    }
  }, [mode, courseId]);

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
  };
}
