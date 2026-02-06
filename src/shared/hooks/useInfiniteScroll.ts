'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type PageResponse<T> = {
  content: T[];
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
};

export type UseInfiniteScrollOptions<T> = {
  loadPage: (page: number) => Promise<PageResponse<T>>;
  initialPage?: number;
  enabled?: boolean;
};

export type UseInfiniteScrollResult<T> = {
  items: T[];
  isLoading: boolean;
  hasNext: boolean;
  setTarget: (node: HTMLElement | null) => void;
  reset: () => void;
};

export function useInfiniteScroll<T>(
  options: UseInfiniteScrollOptions<T>,
): UseInfiniteScrollResult<T> {
  const { loadPage, initialPage = 0, enabled = true } = options;

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const loadMore = useCallback(async () => {
    if (!enabled || isLoading || !hasNext) return;

    setIsLoading(true);
    try {
      const res = await loadPage(page);

      setItems((prev) => [...prev, ...res.content]);
      setHasNext(res.hasNext);
      setPage(res.currentPage + 1);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, isLoading, hasNext, loadPage, page]);

  return {
    items,
    isLoading,
    hasNext,
    setTarget: () => {},
    reset: () => {},
  };
}
