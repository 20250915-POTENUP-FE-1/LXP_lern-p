'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type SortValue = 'newest' | 'oldest' | 'price-asc' | 'price-desc';

interface CourseListQueryState {
  sort: SortValue;
}

interface UseCourseListQueryReturn extends CourseListQueryState {
  setSort: (value: SortValue) => void;
}

export function useCourseListQuery(): UseCourseListQueryReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortParam = searchParams.get('category');
  const sort: SortValue =
    sortParam === 'oldest' || sortParam === 'price-asc' || sortParam === 'price-desc'
      ? sortParam
      : 'newest';

  const setSort = useCallback(
    (value: SortValue) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', value);

      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;

      router.push(nextUrl);
    },
    [pathname, router, searchParams],
  );

  return { sort, setSort };
}
