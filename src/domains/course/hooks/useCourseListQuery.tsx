'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CourseLevel } from '../types/course';

export type SortValue = 'newest' | 'oldest' | 'price-asc' | 'price-desc';

interface CourseListQueryState {
  sort: SortValue;
  page: number;
  size: number;
  categoryId: number | null;
  level: CourseLevel | null;
  keyword: string;
}

interface UseCourseListQueryReturn extends CourseListQueryState {
  setSort: (value: SortValue) => void;
  setPage: (value: number) => void;
  setSize: (value: number) => void;
  setCategoryId: (value: number | null) => void;
  setCategoryAndKeyword: (categoryId: number | null, keyword: string | null) => void;
  setCategoryLevelAndKeyword: (
    categoryId: number | null,
    level: CourseLevel | null,
    keyword: string | null,
  ) => void;
  setLevel: (value: CourseLevel | null) => void;
  searchByKeyword: (value: string) => void;
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

  const sizeParam = searchParams.get('size');
  const sizeValue = sizeParam ? Number(sizeParam) : 10;
  const size = Number.isFinite(sizeValue) && sizeValue > 0 ? sizeValue : 10;

  const categoryIdParam = searchParams.get('categoryId');
  const categoryId = categoryIdParam ? Number(categoryIdParam) : null;

  const levelParam = searchParams.get('level');
  const level: CourseLevel | null =
    levelParam && VALID_LEVELS.includes(levelParam as CourseLevel)
      ? (levelParam as CourseLevel)
      : null;

  const keyword = searchParams.get('keyword') ?? '';

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

      const orderedKeys = ['categoryId', 'level', 'keyword', 'sort', 'page', 'size'];
      const orderedParams = new URLSearchParams();
      for (const key of orderedKeys) {
        const value = params.get(key);
        if (value != null) {
          orderedParams.set(key, value);
        }
      }

      const query = orderedParams.toString();
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

  const setSize = useCallback(
    (value: number) => updateParams({ size: String(value), page: null }),
    [updateParams],
  );

  const setCategoryId = useCallback(
    (value: number | null) =>
      updateParams({ categoryId: value != null ? String(value) : null, page: null }),
    [updateParams],
  );

  const setCategoryAndKeyword = useCallback(
    (value: number | null, nextKeyword: string | null) =>
      updateParams({
        categoryId: value != null ? String(value) : null,
        keyword: nextKeyword || null,
        page: null,
      }),
    [updateParams],
  );

  const setCategoryLevelAndKeyword = useCallback(
    (value: number | null, nextLevel: CourseLevel | null, nextKeyword: string | null) =>
      updateParams({
        categoryId: value != null ? String(value) : null,
        level: nextLevel ?? null,
        keyword: nextKeyword || null,
        page: null,
      }),
    [updateParams],
  );
  const setLevel = useCallback(
    (value: CourseLevel | null) => updateParams({ level: value, page: null }),
    [updateParams],
  );

  const searchByKeyword = useCallback(
    (value: string) =>
      updateParams({
        keyword: value || null,
        categoryId: null,
        level: null,
        sort: null,
        page: null,
      }),
    [updateParams],
  );

  return {
    sort,
    page,
    size,
    categoryId,
    level,
    keyword,
    setSort,
    setPage,
    setSize,
    setCategoryId,
    setCategoryAndKeyword,
    setCategoryLevelAndKeyword,
    setLevel,
    searchByKeyword,
  };
}
