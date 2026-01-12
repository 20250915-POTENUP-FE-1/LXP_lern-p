'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Review } from '@/domains/course/types/review';
import { MOCK_GET_COURSE_REVIEWS } from '@/mocks/review.mock';
import { getAllReviews } from '../services/reviewService';
import { get } from 'http';

type CreateReviewRequest = {
  rating: number;
  content: string;
};

type UpdateReviewRequest = {
  rating: number;
  content: string;
};

type UseCourseReviewsProps = {
  nickname?: string; // 로그인 유저 닉네임 (항상 있어야 함)
};

type MyReviewStatus = { status: 'none' } | { status: 'exists'; reviewId: string };

export function useCourseReviews(courseId: string, options?: UseCourseReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const nickname = options?.nickname;

  // 1) courseId 바뀔 때마다 리뷰 로드 (dev면 mock, 아니면 api)
  useEffect(() => {
    if (!courseId) return;

    (async () => {
      try {
        const list =
          // TODO: 나중에 API 생기면 여기서 분기
          process.env.NODE_ENV === 'development'
            ? (MOCK_GET_COURSE_REVIEWS[courseId] ?? [])
            : await getAllReviews;

        setReviews;
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
    //TODO: 리뷰 생성 서버 연동 시 수정 필요
    // async (payload: CreateReviewRequest) => {
    (payload: CreateReviewRequest) => {
      if (!nickname) {
        throw new Error('MISSING_NICKNAME');
      }

      //const data = await createReviewApi(courseId, payload);

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
    //TODO: 리뷰 수정 서버 연동 시 수정 필요
    //async (reviewId: string, payload: UpdateReviewRequest) => {
    //await updateReviewApi(courseId, reviewId, payload); //

    (reviewId: string, payload: UpdateReviewRequest) => {
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
    [],
  );

  const deleteReview = useCallback(
    (reviewId: string) => {
      //TODO: 리뷰 삭제 서버 연동 시 수정 필요
      // async (reviewId: string) => {
      //await deleteReviewApi(courseId, reviewId);
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
