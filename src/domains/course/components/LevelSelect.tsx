'use client';

import { useCourseListQuery } from '../hooks/useCourseListQuery';
import type { CourseLevel } from '../types/course';
import styles from './LevelSelect.module.css';

const LEVEL_OPTIONS: { label: string; value: CourseLevel | 'ALL' }[] = [
  { label: '전체', value: 'ALL' },
  { label: '입문', value: 'BEGINNER' },
  { label: '초급', value: 'NOVICE' },
  { label: '중급', value: 'INTERMEDIATE' },
  { label: '고급', value: 'ADVANCED' },
];

export function LevelSelect() {
  const { level, setLevel } = useCourseListQuery();

  return (
    <div className={styles['level-select']} role="group" aria-label="난이도">
      {LEVEL_OPTIONS.map((option) => {
        const isActive = (level ?? 'ALL') === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={`${styles['level-select__button']} ${
              isActive ? styles['level-select__button--active'] : ''
            }`}
            onClick={() => setLevel(option.value === 'ALL' ? null : option.value)}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
