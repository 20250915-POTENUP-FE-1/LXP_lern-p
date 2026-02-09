'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CourseLevel } from '../types/course';

export type SortValue = 'newest' | 'oldest' | 'price-asc' | 'price-desc';

interface CourseListQueryState {
  sort: SortValue;
  page: number;
  categoryId: number | null;
  level: CourseLevel | null;
  title: string;
}

interface UseCourseListQueryReturn extends CourseListQueryState {
  setSort: (value: SortValue) => void;
  setPage: (value: number) => void;
  setCategoryId: (value: number | null) => void;
  setLevel: (value: CourseLevel | null) => void;
  setTitle: (value: string) => void;
}

const VALID_LEVELS: CourseLevel[] = ['BEGINNER', 'NOVICE', 'INTERMEDIATE', 'ADVANCED'];

export function useCourseListQuery(): UseCourseListQueryReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortParam = searchParams.get('sort');
  const sort: SortValue =
    sortParam === 'oldest' || sortParam === 'price-asc' || sortParam === 'price-desc'
      ? sortParam
      : 'newest';

  const pageParam = searchParams.get('page');
  const page = pageParam ? Math.max(0, Number(pageParam)) : 0;

  const categoryIdParam = searchParams.get('categoryId');
  const categoryId = categoryIdParam ? Number(categoryIdParam) : null;

  const levelParam = searchParams.get('level');
  const level: CourseLevel | null =
    levelParam && VALID_LEVELS.includes(levelParam as CourseLevel)
      ? (levelParam as CourseLevel)
      : null;

  const title = searchParams.get('title') ?? '';

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value == null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const setSort = useCallback(
    (value: SortValue) => updateParams({ sort: value, page: null }),
    [updateParams],
  );

  const setPage = useCallback(
    (value: number) => updateParams({ page: String(value) }),
    [updateParams],
  );

  const setCategoryId = useCallback(
    (value: number | null) =>
      updateParams({ categoryId: value != null ? String(value) : null, page: null }),
    [updateParams],
  );

  const setLevel = useCallback(
    (value: CourseLevel | null) => updateParams({ level: value, page: null }),
    [updateParams],
  );

  const setTitle = useCallback(
    (value: string) => updateParams({ title: value || null, page: null }),
    [updateParams],
  );

  return {
    sort,
    page,
    categoryId,
    level,
    title,
    setSort,
    setPage,
    setCategoryId,
    setLevel,
    setTitle,
  };
}
