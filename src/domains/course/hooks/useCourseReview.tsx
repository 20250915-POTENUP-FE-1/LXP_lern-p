'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Review } from '@/domains/course/types/course';

type CreateReviewPayload = {
  rating: number;
  content: string;
};

type UseCourseReviewsOptions = {
  initialReviews?: Review[];
  nickname?: string; // 로그인 유저 닉네임 (항상 있어야 함)
};

type MyReviewStatus = { status: 'none' } | { status: 'exists'; reviewId: string };

export function useCourseReviews(courseId: string, options?: UseCourseReviewsOptions) {
  const [reviews, setReviews] = useState<Review[]>(options?.initialReviews ?? []);
  const nickname = options?.nickname; // fallback 없음

  const myReview = useMemo(() => reviews.find((r) => r.isMine), [reviews]);

  const myReviewStatus: MyReviewStatus = useMemo(() => {
    if (!myReview) return { status: 'none' };
    return { status: 'exists', reviewId: myReview.id };
  }, [myReview]);

  const canWriteReview = myReviewStatus.status === 'none';

  const addReviewMock = useCallback(
    (payload: CreateReviewPayload) => {
      if (!nickname) {
        throw new Error('MISSING_NICKNAME');
      }

      const now = new Date().toISOString();

      const newReview: Review = {
        id: globalThis.crypto?.randomUUID?.() ?? `rev_${Date.now()}`,
        courseId,
        rating: payload.rating,
        content: payload.content,
        createdAt: now,
        updatedAt: now,
        user: { nickname },
        isMine: true,
        status: 'DISPLAY',
      };

      setReviews((prev) => [newReview, ...prev]);
      return newReview;
    },
    [courseId, nickname],
  );

  const addReview = useCallback(
    async (payload: CreateReviewPayload) => {
      if (myReviewStatus.status === 'exists') {
        throw new Error('ALREADY_REVIEWED');
      }
      return addReviewMock(payload);
    },
    [addReviewMock, myReviewStatus.status],
  );

  return {
    reviews,
    myReviewStatus,
    canWriteReview,
    addReview,
    setReviews, // 필요 없으면 제거
  };
}
