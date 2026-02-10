'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type PageResponse<T> = {
  content: T[];
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
};

export type UseInfiniteScrollProps<T> = {
  loadPage: (page: number) => Promise<PageResponse<T>>;
  initialPage?: number;
  enabled?: boolean;
};

export type UseInfiniteScrollResult<T> = {
  items: T[];
  isLoading: boolean;
  hasNext: boolean;
  error: Error | null;
  setTarget: (node: HTMLElement | null) => void;
  reset: () => void;
  reload: () => void;
};

export function useInfiniteScroll<T>({
  loadPage,
  initialPage = 0,
  enabled = true,
}: UseInfiniteScrollProps<T>): UseInfiniteScrollResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  const loadMoreRef = useRef<() => void>(() => {});
  const requestIdRef = useRef(0);

  const pageRef = useRef(initialPage);
  const didInitLoadRef = useRef(false);
  const isLoadingRef = useRef(false); // state 반영 타이밍 문제 방지

  const loadMore = useCallback(async () => {
    if (!enabled || isLoadingRef.current || !hasNext) return;

    const requestId = ++requestIdRef.current;
    const page = pageRef.current;

    // 요청 즉시 page 증가 → 중복 요청 방지
    pageRef.current += 1;
    isLoadingRef.current = true;

    setIsLoading(true);
    setError(null);

    try {
      const res = await loadPage(page);

      if (requestId !== requestIdRef.current) return;

      setItems((prev) => [...prev, ...res.content]);
      setHasNext(res.hasNext);
    } catch (e) {
      // 실패 시 page 되돌림 (다시 시도 가능)
      pageRef.current -= 1;

      if (requestId === requestIdRef.current) {
        setError(e as Error);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    }
  }, [enabled, hasNext, loadPage]);

  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  useEffect(() => {
    if (!enabled) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMoreRef.current();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      },
    );

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [enabled]);

  const setTarget = useCallback((node: HTMLElement | null) => {
    const observer = observerRef.current;

    if (observer && targetRef.current) {
      observer.unobserve(targetRef.current);
    }

    targetRef.current = node;

    if (observer && node) {
      observer.observe(node);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (didInitLoadRef.current) return;

    didInitLoadRef.current = true;
    loadMore();
  }, [enabled, loadMore]);

  const reset = useCallback(() => {
    requestIdRef.current++;

    setItems([]);
    setHasNext(true);
    setIsLoading(false);
    setError(null);

    pageRef.current = initialPage;
    isLoadingRef.current = false;
    didInitLoadRef.current = false;
  }, [initialPage]);

  // enabled off 시 정리
  useEffect(() => {
    if (!enabled) {
      reset();
    }
  }, [enabled, reset]);

  // reload = reset + 초기 로드 다시
  const reload = useCallback(() => {
    reset();
  }, [reset]);

  return {
    items,
    isLoading,
    hasNext,
    error,
    setTarget,
    reset,
    reload,
  };
}
