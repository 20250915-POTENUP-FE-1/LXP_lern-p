'use client';

import styles from './CourseForm.module.css';
import { SelectCategory } from './SelectCategory';
import { ThumbnailUploader } from './ThumbnailUploader';
import { useCourseForm } from '../hooks/useCourseForm';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type CourseFormProps = {
  mode?: 'create' | 'edit';
  courseId?: string;
};

export function CourseForm({ mode, courseId }: CourseFormProps = {}) {
  const router = useRouter();
  const {
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
  } = useCourseForm();

  return (
    <form onSubmit={handleFormSubmit} className={styles['course-form']} aria-label="강좌 등록 폼">
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
              onChange={handleCategoryChange}
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
              value={formData.thumbnailUrl}
              onUploadComplete={handleThumbnailUpload}
              onFileSelect={handleThumbnailFileSelect}
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

      {/* 저장/취소 버튼 수정 */}
      <div className={styles['form-actions']}>
        <button
          type="button"
          className={`${styles['btn']} ${styles['btn--ghost']}`}
          onClick={() => router.back()}
        >
          취소
        </button>

        <button
          type="submit"
          disabled={loading || isInvalid}
          className={`${styles['btn']} ${styles['btn--primary']}`}
        >
          다음
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>오류: {error}</p>}
      {success && <p style={{ color: 'green' }}>등록 완료!</p>}
    </form>
  );
}
