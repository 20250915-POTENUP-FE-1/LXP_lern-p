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
};

export function useInfiniteScroll<T>({
  loadPage,
  initialPage = 0,
  enabled = true,
}: UseInfiniteScrollProps<T>): UseInfiniteScrollResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  const loadMoreRef = useRef<() => void>(() => {}); // observe 고정, 로딩 로직만 최신 유지
  const requestIdRef = useRef(0); // 유효 요청 식별 토큰
  const didInitLoadRef = useRef(false); // 초기 로드 체크 플래그

  const loadMore = useCallback(async () => {
    if (!enabled || isLoading || !hasNext) return;

    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    try {
      setError(null);
      const res = await loadPage(page);

      // 늦게 온 응답 무시
      if (requestId !== requestIdRef.current) return;

      setItems((prev) => [...prev, ...res.content]);
      setHasNext(res.hasNext);
      setPage((prev) => prev + 1);
    } catch (e) {
      if (requestId === requestIdRef.current) {
        setError(e as Error);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [enabled, isLoading, hasNext, loadPage, page]);

  // 최신 loadMore를 observer에서 참조
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  // observer는 1회만 생성
  useEffect(() => {
    if (!enabled) return;

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMoreRef.current();
      }
    });

    // observer 생성 시 이미 target이 있으면 바로 observe
    if (targetRef.current) {
      observerRef.current.observe(targetRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [enabled]);

  const setTarget = useCallback((node: HTMLElement | null) => {
    targetRef.current = node;

    if (!observerRef.current || !node) return;

    observerRef.current.observe(node);
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
    setPage(initialPage);
    setHasNext(true);
    setIsLoading(false);
    setError(null);
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
    error,
    setTarget,
    reset,
  };
}
