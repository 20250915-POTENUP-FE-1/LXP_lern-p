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

export function useInfiniteScroll<T>() {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  return {
    items,
    isLoading,
    hasNext,
    setTarget: () => {},
    reset: () => {},
  };
}
