import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { validateForm } from '@/shared/util/validateForm';

import { buildCourseDraft, type CourseFormState } from '../utils/courseDraft';
import { fetchCourseData, updateDraftCourse } from '../services/courseEditService';
import { createDraftCourse } from '../services/courseCreateService';
import { getCategories } from '../services/courseCreateService';
import type { Category, CourseDraftForm } from '../types/course';

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

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

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
      if (mode === 'create') {
        // 1) 로컬 draft 유지 (기존 동작 유지)
        try {
          sessionStorage.setItem('courseDraft_step1', JSON.stringify(draftData));
        } catch (err) {
          console.error('세션 저장 실패:', err);
          alert('임시 저장 중 오류가 발생했습니다. 브라우저 설정을 확인해주세요.');
          return;
        }
        // 2) 서버에 draft 강좌 생성 → courseId 확보
        const { courseId } = await createDraftCourse(draftData, thumbnailFile ?? undefined);

        // 3) Step2에서 쓸 courseId 저장
        sessionStorage.setItem('draftCourseId', String(courseId));

        // 4) URL은 create 유지
        router.push('/courses/create?step=2');
        return;
      } else {
        // mode === 'edit'
        if (!courseId) {
          throw new Error('유효하지 않은 강좌 ID입니다.');
        }

        // 1) 서버에 강좌 기본 정보 수정 (강좌 수정 API)
        await updateDraftCourse(courseId, draftData);

        setSuccess(true);

        // 2) 섹션/강의 편집 step2로 이동
        router.push(`/courses/${courseId}/edit?step=2`);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '강좌 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 조회 + 초기 데이터 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 카테고리 로드
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('카테고리 조회 실패:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();

    // edit 모드일 때 기존 강좌 불러오기
    if (mode === 'edit' && courseId) {
      const loadCourseData = async () => {
        setLoading(true);
        try {
          const data = await fetchCourseData(courseId);

          const nextForm: CourseFormState = {
            title: data.title ?? '',
            summary: data.summary ?? '',
            description: data.description ?? '',
            category: data.category ?? [],
            level: data.level ?? '',
            price: data.price == null ? '' : String(data.price),
            thumbnailUrl: data.thumbnail ?? '',
          };

          setFormData(nextForm);
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

    // create 모드일 때 기존 draft 복원 로직 (기존 유지)
    if (mode === 'create') {
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
      }
    }
  }, [mode, courseId]);

  return {
    formData,
    categories,
    categoriesLoading,
    loading,
    error,
    success,
    isInvalid,
    handleFormSubmit,
    handleChange,
    handleCategoryChange,
    handleThumbnailUpload,
    handleThumbnailFileSelect,
  };
}
