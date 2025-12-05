'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { createCourse } from '@/domains/course/services/courseService';
import type {
  CreateCourseRequest,
  CreateSectionRequest,
  CreateLectureRequest,
} from '@/domains/course/types/course';
import { validateForm } from '@/shared/util/validateForm';

import { LectureUploader } from './LectureUploader';
import { SelectCategory } from './SelectCategory';
import { ThumbnailUploader } from './ThumbnailUploader';
import styles from './CourseForm.module.css';

type CourseForm = {
  title: string;
  summary: string;
  description: string;
  category: string[];
  level: string;
  price: number | ''; // input 제어용
  thumbnailUrl: string;
};

type LectureDraft = CreateLectureRequest & {
  id: string;
};

type SectionDraft = {
  id: string;
  title: string;
  lectures: LectureDraft[];
};

const createEmptyLecture = (): LectureDraft => ({
  id:
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : String(Date.now() + Math.random()),
  title: '',
  duration: 0,
  videoUrl: '',
});

const createEmptySection = (): SectionDraft => ({
  id:
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : String(Date.now() + Math.random()),
  title: '',
  lectures: [createEmptyLecture()],
});

export function CourseForm() {
  const router = useRouter();
  const { user } = useAuthState();

  const [formData, setFormData] = useState<CourseForm>({
    title: '',
    summary: '',
    description: '',
    category: [],
    level: '',
    price: '',
    thumbnailUrl: '',
  });

  const [sections, setSections] = useState<SectionDraft[]>([createEmptySection()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  // 기본 입력값 검사 + 섹션/강의 유효성
  const baseInvalid = validateForm(formData);
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
  const isInvalid = baseInvalid || structureInvalid;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: id === 'price' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleCourseCreate = async (e: FormEvent<HTMLFormElement>) => {
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

    try {
      // CreateCourseRequest으로 매핑
      const courseInput: CreateCourseRequest = {
        title: formData.title,
        summary: formData.summary,
        description: formData.description,
        thumbnailUrl: formData.thumbnailUrl,
        category: formData.category,
        level: formData.level,
        price: Number(formData.price || 0),
      };

      // CreateSectionRequest으로 매핑 (id 제거)
      const sectionInput: CreateSectionRequest[] = sections.map((section) => ({
        title: section.title,
        lectures: section.lectures.map<CreateLectureRequest>((lecture) => ({
          title: lecture.title,
          videoUrl: lecture.videoUrl,
          duration: lecture.duration,
        })),
      }));

      const courseId = await createCourse(user, courseInput, sectionInput);
      setSuccess(true);
      router.replace(`/courses/${courseId}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '강좌 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <form onSubmit={handleCourseCreate} className={styles['course-form']} aria-label="강좌 등록 폼">
      <div className={styles['form-grid']}>
        <div className={styles['form-grid__main']}>
          {/* 강좌명 */}
          <div className={styles['course-form__field']}>
            <label htmlFor="title" className={styles['course-form__label']}>
              강좌명 <span className={styles['course-form__req']}>*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={styles['course-form__input']}
              placeholder="예: React 입문"
              required
            />
          </div>

          {/* 한 줄 소개 */}
          <div className={styles['course-form__field']}>
            <label htmlFor="summary" className={styles['course-form__label']}>
              한 줄 소개 <span className={styles['course-form__req']}>*</span>
            </label>
            <input
              id="summary"
              type="text"
              value={formData.summary}
              onChange={handleChange}
              className={styles['course-form__input']}
              required
            />
          </div>

          {/* 상세 설명 */}
          <div className={`${styles['course-form__field']} ${styles['course-form__field--full']}`}>
            <label htmlFor="description" className={styles['course-form__label']}>
              상세 설명 <span className={styles['course-form__req']}>*</span>
            </label>
            <textarea
              id="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className={styles['course-form__textarea']}
              required
            />
          </div>

          {/* 카테고리 */}
          <div className={styles['course-form__field']}>
            <label className={styles['course-form__label']} htmlFor="category">
              카테고리 <span className={styles['course-form__req']}>*</span>
            </label>
            <SelectCategory
              id="category"
              value={formData.category}
              onChange={(category) => setFormData((prev) => ({ ...prev, category }))}
            />
          </div>

          {/* 난이도 */}
          <div className={styles['course-form__field']}>
            <label htmlFor="level" className={styles['course-form__label']}>
              난이도 <span className={styles['course-form__req']}>*</span>
            </label>
            <select
              id="level"
              value={formData.level}
              onChange={handleChange}
              className={styles['course-form__select']}
            >
              <option value="" disabled>
                난이도 선택
              </option>
              <option>입문</option>
              <option>초급</option>
              <option>중급</option>
              <option>고급</option>
            </select>
          </div>

          {/* 썸네일 */}
          <div className={styles['course-form__field']}>
            <label htmlFor="thumbnail" className={styles['form__label']}>
              썸네일 <span className={styles['course-form__req']}>*</span>
            </label>
            <ThumbnailUploader
              onUploadComplete={(url) => setFormData((prev) => ({ ...prev, thumbnailUrl: url }))}
            />
          </div>

          {/* 가격 */}
          <div className={styles['course-form__field']}>
            <label htmlFor="price" className={styles['course-form__label']}>
              가격(₩) <span className={styles['course-form__req']}>*</span>
            </label>
            <input
              id="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className={styles['course-form__input']}
              min={0}
              required
            />
          </div>
        </div>
      </div>

      {/* 섹션 / 강의 구성 */}
      <div className={styles['course-form__field']}>
        <label htmlFor="lecture" className={styles['form__label']}>
          섹션 <span className={styles['course-form__req']}>*</span>
        </label>

        <section className={styles['sections']} aria-label="섹션 구성">
          {sections.map((section, sectionIdx) => (
            <div key={section.id} className={styles['section']}>
              <header className={styles['section-list__header']}>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    setSections((prev) =>
                      prev.map((s) => (s.id === section.id ? { ...s, title: e.target.value } : s)),
                    )
                  }
                  className={styles['course-form__input']}
                  placeholder={`섹션 ${sectionIdx + 1} 제목 입력`}
                />

                <div className={styles['section-list__actions']}>
                  <button
                    type="button"
                    className={styles['section-list__action']}
                    onClick={() => handleSectionDelete(section.id)}
                  >
                    섹션 삭제
                  </button>
                </div>
              </header>

              <ul className={styles['lecture-list']}>
                {section.lectures.map((lecture) => (
                  <li key={lecture.id} className={styles['lecture-list__item']}>
                    <div className={styles['lecture-list__edit-group']}>
                      <input
                        type="text"
                        value={lecture.title}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    lectures: s.lectures.map((l) =>
                                      l.id === lecture.id ? { ...l, title: e.target.value } : l,
                                    ),
                                  }
                                : s,
                            ),
                          )
                        }
                        className={styles['course-form__input']}
                        placeholder="강의 제목 입력"
                      />
                    </div>

                    <LectureUploader
                      onUploadComplete={({ videoUrl, duration }) => {
                        setSections((prev) =>
                          prev.map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  lectures: s.lectures.map((l) =>
                                    l.id === lecture.id ? { ...l, videoUrl, duration } : l,
                                  ),
                                }
                              : s,
                          ),
                        );
                      }}
                    />

                    <button
                      type="button"
                      className={`${styles['lecture-list__action']} ${styles['lecture-list__action--danger']}`}
                      onClick={() => handleLectureDelete(section.id, lecture.id)}
                    >
                      강의 삭제
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={styles['section-list__action']}
                onClick={() => handleLectureAdd(section.id)}
              >
                + 강의 추가
              </button>
            </div>
          ))}

          <button
            type="button"
            className={styles['section-list__action']}
            onClick={handleSectionAdd}
          >
            + 새 섹션 추가
          </button>
        </section>
      </div>

      {/* 저장/취소 */}

      <div className={styles['form-actions']}>
        <Link href="/courses" className={`${styles['btn']} ${styles['btn--ghost']}`}>
          취소
        </Link>
        <button
          type="submit"
          disabled={loading || isInvalid}
          className={`${styles['btn']} ${styles['btn--primary']}`}
        >
          {loading ? '등록 중...' : '등록하기'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>오류: {error}</p>}
      {success && <p style={{ color: 'green' }}>등록 완료!</p>}
    </form>
  );
}
