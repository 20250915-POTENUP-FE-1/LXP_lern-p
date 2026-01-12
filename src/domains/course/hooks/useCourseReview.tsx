'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Review } from '@/domains/course/types/review';
import { MOCK_GET_COURSE_REVIEWS } from '@/mocks/review.mock';
import { getCourseReviews } from '../services/reviewService';

type CreateReviewPayload = {
  rating: number;
  content: string;
};

type UseCourseReviewsOptions = {
  nickname?: string; // 로그인 유저 닉네임 (항상 있어야 함)
};

type MyReviewStatus = { status: 'none' } | { status: 'exists'; reviewId: string };

export function useCourseReviews(courseId: string, options?: UseCourseReviewsOptions) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const nickname = options?.nickname; // fallback 없음

  // 1) courseId 바뀔 때마다 리뷰 로드 (dev면 mock, 아니면 api)
  useEffect(() => {
    if (!courseId) return;

    (async () => {
      try {
        const list =
          // TODO: 나중에 API 생기면 여기서 분기
          process.env.NODE_ENV === 'development'
            ? (MOCK_GET_COURSE_REVIEWS[courseId] ?? [])
            : await getCourseReviews(courseId);

        setReviews(list);
      } catch (err) {
        // 실패하면 빈 배열로 (UI 안전)
        console.error('리뷰 불러오기 실패:', err);
        setReviews([]);
      }
    })();
  }, [courseId]);

  const myReview = useMemo(() => reviews.find((r) => r.isMine), [reviews]);

  const myReviewStatus: MyReviewStatus = useMemo(() => {
    if (!myReview) return { status: 'none' };
    return { status: 'exists', reviewId: myReview.id };
  }, [myReview]);

  const canWriteReview = myReviewStatus.status === 'none';

  const createReview = useCallback(
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

      // TODO: 나중에 API 생기면 여기서 분기해서 호출하면 됨.
      // if (process.env.NODE_ENV !== 'development') await createReviewApi(courseId, payload);

      return createReview(payload);
    },
    [createReview, myReviewStatus.status],
  );

  return {
    reviews,
    myReviewStatus,
    canWriteReview,
    createReview,
    // setReviews는 이제 외부에서 안 만지는 게 안정적이라 제거 추천
  };
}
