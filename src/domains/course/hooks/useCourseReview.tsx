'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  CreateReviewRequest,
  GetReviewResponse,
  Review,
  UpdateReviewRequest,
} from '@/domains/course/types/review';
import { MOCK_GET_COURSE_REVIEWS } from '@/mocks/review.mock';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { USE_MOCK } from '@/shared/constants/config';
import {
  createReview as createReviewApi,
  deleteReview as deleteReviewApi,
  getAllReviews,
  getMyReview,
  updateReview as updateReviewApi,
} from '../services/reviewService';

type MyReviewStatus = { status: 'none' } | { status: 'exists'; reviewId: string };

type UseCourseReviewsOptions = {
  fetchAll?: boolean;
};

export function useCourseReviews(courseId: string, options?: UseCourseReviewsOptions) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReviewState, setMyReviewState] = useState<Review | null>(null);
  const { user } = useAuthState();
  const shouldFetchAll = options?.fetchAll ?? true;

  useEffect(() => {
    if (!courseId || !shouldFetchAll) return;

    (async () => {
      try {
        const items = USE_MOCK ? MOCK_GET_COURSE_REVIEWS : ((await getAllReviews(courseId)) ?? []);

        const mapped: Review[] = items.content.map((it: GetReviewResponse) =>
          mapReview(it, courseId),
        );

        setReviews(mapped);
      } catch (e) {
        console.error('리뷰 불러오기 실패:', e);
        setReviews([]);
      }
    })();
  }, [courseId]);

  useEffect(() => {
    if (USE_MOCK) return;
    if (!courseId || !user) return;

    let cancelled = false;
    (async () => {
      try {
        const review = await getMyReview(courseId);
        if (cancelled) return;
        setMyReviewState(mapReview(review, courseId, true));
      } catch (e) {
        if (cancelled) return;
        setMyReviewState(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId, user]);

  const myReview = useMemo(() => {
    if (!courseId || !user) return null;

    if (USE_MOCK) {
      if (shouldFetchAll) {
        return reviews.find((r) => r.isMine) ?? null;
      }
      const list = MOCK_GET_COURSE_REVIEWS.content ?? [];
      const mine = list.find((r) => Boolean(r.isMine));
      return mine ? mapReview(mine, courseId, true) : null;
    }

    if (!myReviewState) return null;
    if (String(myReviewState.courseId) !== String(courseId)) return null;
    return myReviewState;
  }, [courseId, user, reviews, shouldFetchAll, myReviewState]);

  const myReviewStatus: MyReviewStatus = useMemo(() => {
    if (!myReview) return { status: 'none' };
    return { status: 'exists', reviewId: myReview.id };
  }, [myReview]);

  const canWriteReview = myReviewStatus.status === 'none';

  // A 방식: 저장만 (버튼 전환은 상위에서 isReviewed=true 처리)
  const writeReview = useCallback(
    async (payload: CreateReviewRequest) => {
      if (!courseId || !user) return;

      // mock 단계에서는 실제 API 호출 생략
      if (!USE_MOCK) {
        await createReviewApi(courseId, {
          rating: payload.rating,
          content: payload.content.trim(),
        });
      }

      const now = new Date().toISOString();

      // mock / real 공통: UI 즉시 반영
      const newReview: Review = {
        id: globalThis.crypto?.randomUUID?.() ?? `rev_${Date.now()}`,
        courseId,
        nickname: user.nickname,
        rating: payload.rating ?? 0,
        content: payload.content?.trim() ?? '',
        createdAt: now,
        updatedAt: now,
        isMine: true,
        status: 'DISPLAY',
      };

      setMyReviewState(newReview);
      setReviews((prev) => [newReview, ...prev.map((r) => ({ ...r, isMine: false }))]);
    },
    [courseId, user],
  );

  // 수정: API가 courseId 기반이라 reviewId 필요 없음
  const editReview = useCallback(
    async (payload: UpdateReviewRequest) => {
      if (!courseId) return;

      if (USE_MOCK) {
        const now = new Date().toISOString();
        const nextReview = myReviewState
          ? {
              ...myReviewState,
              rating: payload.rating,
              content: payload.content.trim(),
              updatedAt: now,
            }
          : null;

        setMyReviewState(nextReview);
        setReviews((prev) =>
          prev.map((r) =>
            r.isMine
              ? {
                  ...r,
                  rating: payload.rating,
                  content: payload.content.trim(),
                  updatedAt: now,
                }
              : r,
          ),
        );
        return;
      }

      await updateReviewApi(courseId, {
        rating: payload.rating,
        content: payload.content.trim(),
      });

      const now = new Date().toISOString();
      if (myReviewState) {
        setMyReviewState({
          ...myReviewState,
          rating: payload.rating,
          content: payload.content.trim(),
          updatedAt: now,
        });
      }
      setReviews((prev) =>
        prev.map((r) =>
          r.isMine
            ? {
                ...r,
                rating: payload.rating,
                content: payload.content.trim(),
                updatedAt: now,
              }
            : r,
        ),
      );
    },
    [courseId, myReviewState],
  );

  // 삭제: API가 courseId 기반이라 reviewId 필요 없음
  const removeReview = useCallback(async () => {
    if (!courseId) return;

    if (USE_MOCK) {
      setReviews((prev) => prev.filter((r) => !r.isMine));
      setMyReviewState(null);
      return;
    }

    await deleteReviewApi(courseId);
    setReviews((prev) => prev.filter((r) => !r.isMine));
    setMyReviewState(null);
  }, [courseId]);

  return {
    reviews,
    myReview,
    myReviewStatus,
    canWriteReview,
    writeReview,
    editReview,
    removeReview,
  };
}

const mapReview = (
  review: GetReviewResponse,
  fallbackCourseId: string,
  isMine?: boolean,
): Review => {
  return {
    id: String(review.id),
    courseId: String(review.courseId ?? fallbackCourseId),
    nickname: String(review.nickname ?? ''),
    rating: Number(review.rating ?? 0),
    content: String(review.content ?? ''),
    createdAt: String(review.createdAt ?? ''),
    updatedAt: String(review.updatedAt ?? ''),
    isMine: isMine ?? Boolean(review.isMine),
    status: review.status,
  };
};
