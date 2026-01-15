'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  CreateReviewRequest,
  Review,
  UpdateReviewRequest,
} from '@/domains/course/types/review';
import { MOCK_GET_COURSE_REVIEWS } from '@/mocks/review.mock';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import {
  createReview as createReviewApi,
  deleteReview as deleteReviewApi,
  getAllReviews,
  updateReview as updateReviewApi,
} from '../services/reviewService';
import { USE_MOCK } from '@/shared/constants/env';

type MyReviewStatus = { status: 'none' } | { status: 'exists'; reviewId: string };

export function useCourseReviews(courseId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { user } = useAuthState();

  useEffect(() => {
    if (!courseId) return;

    (async () => {
      try {
        // TODO(mock): 개발 중 환경변수로 강의 리뷰 데이터를 mock으로 조회
        const items = USE_MOCK
          ? (MOCK_GET_COURSE_REVIEWS[courseId] ?? [])
          : await getAllReviews(courseId);

        const mapped: Review[] = (items ?? []).map((it: any) => {
          const nickname = String(it.nickname ?? it.user?.nickname ?? '');

          return {
            id: String(it.id ?? it.reviewId),
            courseId: String(it.courseId ?? courseId),
            nickname,
            rating: Number(it.rating ?? 0),
            content: String(it.content ?? ''),
            createdAt: String(it.createdAt ?? it.createAt ?? ''),
            updatedAt: String(it.updatedAt ?? it.updateAt ?? ''),
            user: { nickname },
            isMine: Boolean(it.isMine),
            status: it.status,
          };
        });

        setReviews(mapped);
      } catch (e) {
        console.error('리뷰 불러오기 실패:', e);
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

  // A 방식: 저장만 (버튼 전환은 상위에서 isReviewed=true 처리)
  const writeReview = useCallback(
    async (payload: CreateReviewRequest) => {
      if (!courseId) return;

      if (process.env.NODE_ENV === 'development') {
        if (!user) return;

        const now = new Date().toISOString();

        // DEV: 화면 확인용 로컬 반영 (원치 않으면 삭제 가능)
        setReviews((prev) => {
          const nickname = user.nickname;
          const newReview: Review = {
            id: globalThis.crypto?.randomUUID?.() ?? `rev_${Date.now()}`,
            courseId,
            nickname,
            rating: payload.rating ?? 0,
            content: payload.content?.trim() ?? '',
            createdAt: now,
            updatedAt: now,
            isMine: true,
            status: 'DISPLAY',
          };

          return [newReview, ...prev.map((r) => ({ ...r, isMine: false }))];
        });

        return;
      }

      await createReviewApi(courseId, {
        rating: payload.rating,
        content: payload.content.trim(),
      });
    },
    [courseId, user],
  );

  // 수정: API가 courseId 기반이라 reviewId 필요 없음
  const editReview = useCallback(
    async (payload: UpdateReviewRequest) => {
      if (!courseId) return;

      if (process.env.NODE_ENV === 'development') {
        const now = new Date().toISOString();
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
    },
    [courseId],
  );

  // 삭제: API가 courseId 기반이라 reviewId 필요 없음
  const removeReview = useCallback(async () => {
    if (!courseId) return;

    if (process.env.NODE_ENV === 'development') {
      setReviews((prev) => prev.filter((r) => !r.isMine));
      return;
    }

    await deleteReviewApi(courseId);
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
