'use client';

import type { ChangeEvent } from 'react';
import { useCourseListQuery } from '../hooks/useCourseListQuery';
import type { CourseLevel } from '../types/course';
import styles from './SortSelect.module.css';

const LEVEL_OPTIONS: { label: string; value: CourseLevel | 'ALL' }[] = [
  { label: '전체 난이도', value: 'ALL' },
  { label: '입문', value: 'BEGINNER' },
  { label: '초급', value: 'NOVICE' },
  { label: '중급', value: 'INTERMEDIATE' },
  { label: '고급', value: 'ADVANCED' },
];

export function LevelSelect() {
  const { level, setLevel } = useCourseListQuery();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as CourseLevel | 'ALL';
    setLevel(value === 'ALL' ? null : value);
  };

  return (
    <div
      className={`${styles['sort']} ${styles['sort--compact']}`}
      role="group"
      aria-label="난이도"
    >
      <select
        id="course-level"
        className={styles['sort__select']}
        aria-label="난이도 선택"
        value={level ?? 'ALL'}
        onChange={handleChange}
      >
        {LEVEL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
