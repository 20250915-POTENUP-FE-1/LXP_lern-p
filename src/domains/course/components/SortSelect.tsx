'use client';

import { ChangeEvent } from 'react';
import { useCourseListQuery, SortValue } from '../hooks/useCourseListQuery';
import styles from './SortSelect.module.css';

interface FirestoreTimestamp {
  toDate: () => Date;
}

type CreatedAtLike = Date | string | number | FirestoreTimestamp | null | undefined;

export interface SortableCourse {
  createdAt?: CreatedAtLike;
  price?: number;
}

function isFirestoreTimestamp(value: CreatedAtLike): value is FirestoreTimestamp {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof value.toDate === 'function'
  );
}

function getTime(value: CreatedAtLike): number {
  if (value == null) {
    return 0;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (isFirestoreTimestamp(value)) {
    const ts = value.toDate().getTime();
    return Number.isNaN(ts) ? 0 : ts;
  }

  const ts = new Date(value as string | number).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

function compareCourses(a: SortableCourse, b: SortableCourse, sort: SortValue): number {
  const timeA = getTime(a.createdAt ?? null);
  const timeB = getTime(b.createdAt ?? null);
  const priceA = a.price ?? 0;
  const priceB = b.price ?? 0;

  if (sort === 'newest') return timeB - timeA;
  if (sort === 'oldest') return timeA - timeB;
  if (sort === 'price-asc') return priceA - priceB;
  if (sort === 'price-desc') return priceB - priceA;

  return 0;
}

export function sortCourses<T extends SortableCourse>(courses: T[], sort: SortValue): T[] {
  const copied = [...courses];
  return copied.sort((a, b) => compareCourses(a, b, sort));
}

const SORT_OPTIONS: { label: string; value: SortValue }[] = [
  { label: '최신순', value: 'newest' },
  { label: '오래된순', value: 'oldest' },
  { label: '가격 낮은순', value: 'price-asc' },
  { label: '가격 높은순', value: 'price-desc' },
];

export function SortSelect() {
  const { sort, setSort } = useCourseListQuery();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value as SortValue);
  };

  return (
    <div className={`${styles['sort']} ${styles['sort--compact']}`} role="group" aria-label="정렬">
      <select
        id="course-sort"
        className={styles['sort__select']}
        aria-label="정렬 기준 선택"
        value={sort}
        onChange={handleChange}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
