'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { getCategories } from '../services/courseCreateService';
import type { Category } from '../types/course';
import styles from './CourseForm.module.css';

type SelectCategoryProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
  id?: string;
};

export function SelectCategory({ value = [], onChange, id }: SelectCategoryProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstId = value[0] ?? '';
  const secondId = value[1] ?? '';

  // 카테고리 조회
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError('카테고리를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const firstCategories = categories;
  const secondCategories =
    firstId && categories.length > 0
      ? (categories.find((cat) => String(cat.categoryId) === firstId)?.children ?? [])
      : [];

  const handleFirstChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextFirstId = e.target.value;
    // 1차만 선택된 상태로 리셋
    onChange?.([nextFirstId]);
  };

  const handleSecondChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextSecondId = e.target.value;
    onChange?.([firstId, nextSecondId]);
  };

  const firstName =
    firstId && categories.length > 0
      ? (categories.find((c) => String(c.categoryId) === firstId)?.name ?? '')
      : '';
  const secondName =
    secondId && secondCategories.length > 0
      ? (secondCategories.find((c) => String(c.categoryId) === secondId)?.name ?? '')
      : '';

  return (
    <>
      <div className={styles['course-form__category-group']}>
        {/* 1차 카테고리 */}
        <select
          id={id}
          value={firstId}
          onChange={handleFirstChange}
          className={styles['course-form__select']}
          disabled={loading || !!error}
        >
          <option value="" disabled>
            {loading ? '로딩 중...' : '1차 카테고리 선택'}
          </option>
          {firstCategories.map((cat) => (
            <option key={cat.categoryId} value={String(cat.categoryId)}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* 2차 카테고리 */}
        <select
          value={secondId}
          onChange={handleSecondChange}
          className={styles['course-form__select']}
          disabled={!firstId || loading || !!error}
        >
          <option value="" disabled>
            2차 카테고리 선택
          </option>
          {secondCategories.map((child) => (
            <option key={child.categoryId} value={String(child.categoryId)}>
              {child.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className={styles['course-form__hint']}>{error}</p>}

      {!error && (
        <p className={styles['course-form__hint']}>
          선택된 카테고리:{' '}
          {firstName && secondName ? `${firstName} > ${secondName}` : '아직 선택되지 않음'}
        </p>
      )}
    </>
  );
}
