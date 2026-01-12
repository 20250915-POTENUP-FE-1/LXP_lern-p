'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  CreateReviewRequest,
  Review,
  UpdateReviewRequest,
} from '@/domains/course/types/review';
import { MOCK_GET_COURSE_REVIEWS } from '@/mocks/review.mock';
import { getAllReviews } from '../services/reviewService';

type UseCourseReviewsProps = {
  nickname?: string;
};

type MyReviewStatus = { status: 'none' } | { status: 'exists'; reviewId: string };

export function useCourseReviews(courseId: string, options?: UseCourseReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const nickname = options?.nickname;

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        const items = await (async () => {
          if (process.env.NODE_ENV === 'development') {
            return MOCK_GET_COURSE_REVIEWS[courseId] ?? [];
          }
          return await getAllReviews(courseId);
        })();

        const mapped: Review[] = items.map((it) => ({
          id: String(it.id),
          courseId: String(it.courseId),
          rating: it.rating,
          content: it.content,
          createdAt: it.createdAt,
          updatedAt: it.updatedAt,
          user: { nickname: '익명' },
          isMine: false,
          status: it.status === 'BLIND' ? 'BLINDED' : 'DISPLAY',
        }));

        setReviews(mapped);
      } catch (err) {
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
    async (payload: CreateReviewRequest) => {
      if (!nickname) {
        throw new Error('MISSING_NICKNAME');
      }

      // TODO: 리뷰 생성 서버 연동 시 수정 필요
      // const data = await createReviewApi(courseId, payload);

      const now = new Date().toISOString();

      const newReview: Review = {
        id: globalThis.crypto?.randomUUID?.() ?? `rev_${Date.now()}`, // String(data.reviewId),
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

  const updateReview = useCallback(
    async (reviewId: string, payload: UpdateReviewRequest) => {
      // TODO: 리뷰 수정 서버 연동 시 수정 필요
      // await updateReviewApi(courseId, reviewId, payload);
      if (!nickname) {
        throw new Error('MISSING_NICKNAME');
      }

      const now = new Date().toISOString();

      let updated: Review | null = null;

      setReviews((prev) =>
        prev.map((review) => {
          if (!review.isMine) return review;

          updated = {
            ...review,
            rating: payload.rating,
            content: payload.content,
            updatedAt: now,
          };

          return updated;
        }),
      );

      return updated;
    },
    [nickname],
  );

  const deleteReview = useCallback(
    async (reviewId: string) => {
      // TODO: 리뷰 삭제 서버 연동 시 수정 필요
      // await deleteReviewApi(courseId, reviewId);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    },
    [courseId],
  );

  return {
    reviews,
    myReviewStatus,
    canWriteReview,
    createReview,
    updateReview,
    deleteReview,
  };
}
