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

export function useInfiniteScroll<T>({
  loadPage,
  initialPage = 0,
  enabled = true,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingPageRef = useRef<number | null>(null);
  const didInitLoadRef = useRef(false);
  const targetRef = useRef<HTMLElement | null>(null);

  const loadMore = useCallback(async () => {
    if (!enabled || isLoading || !hasNext) return;

    if (loadingPageRef.current === page) return;
    loadingPageRef.current = page;

    setIsLoading(true);
    try {
      setError(null);
      const res = await loadPage(page);

      setItems((prev) => [...prev, ...res.content]);
      setHasNext(res.hasNext);

      setPage((prev) => prev + 1);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, isLoading, hasNext, loadPage, page]);

  useEffect(() => {
    if (!enabled) return;

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMore();
      }
    });

    return () => observerRef.current?.disconnect();
  }, [enabled, loadMore]);

  const setTarget = useCallback((node: HTMLElement | null) => {
    if (!observerRef.current) return;

    if (targetRef.current) {
      observerRef.current.unobserve(targetRef.current);
    }

    if (node) {
      observerRef.current.observe(node);
      targetRef.current = node;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (didInitLoadRef.current) return;

    didInitLoadRef.current = true;
    loadMore();
  }, [enabled, loadMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasNext(true);
    setIsLoading(false);

    loadingPageRef.current = null;
    didInitLoadRef.current = false;
  }, [initialPage]);

  useEffect(() => {
    if (!enabled) {
      reset();
    }
  }, [enabled, reset]);

  return {
    items,
    isLoading,
    hasNext,
    setTarget,
    reset,
  };
}
