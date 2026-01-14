'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  CreateReviewRequest,
  Review,
  UpdateReviewRequest,
} from '@/domains/course/types/review';
import { MOCK_GET_COURSE_REVIEWS } from '@/mocks/review.mock';
import { getAllReviews } from '../services/reviewService';

// import { getMyReview } from '@/domains/course/services/reviewService';

type MyReviewStatus = { status: 'none' } | { status: 'exists'; reviewId: string };

type UseCourseReviewsArgs = {
  courseId: string;
  mode?: 'list' | 'mine';
};

export function useCourseReviews({ courseId, mode = 'list' }: UseCourseReviewsArgs) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!courseId) return;

    (async () => {
      try {
        /**
         * mode === 'list'  : 리뷰 다중조회(강의상세 탭)
         * mode === 'mine'  : 내 리뷰 단건조회(마이페이지 모달)
         */
        const items = await (async () => {
          // DEV: mock
          if (process.env.NODE_ENV === 'development') {
            const list = MOCK_GET_COURSE_REVIEWS[courseId] ?? [];
            if (mode === 'mine') {
              // mock에서 내 리뷰만
              return list.filter((r: any) => Boolean(r.isMine));
            }
            // mock 전체
            return list;
          }

          // PROD
          if (mode === 'mine') {
            /**
             * TODO: 내 리뷰 단건조회 API
             * GET /api/courses/{courseId}/review
             *
             * const mine = await getMyReview(courseId);
             * return mine ? [mine] : [];
             */
            return [];
          }

          /**
           * TODO: 리뷰 다중조회 API
           * GET /api/courses/{courseId}/reviews
           */
          return await getAllReviews(courseId);
        })();

        const mapped: Review[] = (items ?? []).map((it: any) => ({
          id: String(it.id),
          courseId: String(it.courseId ?? courseId),
          nickname: String(it.nickname ?? it.user?.nickname ?? ''),
          rating: Number(it.rating ?? 0),
          content: String(it.content ?? ''),
          createdAt: String(it.createdAt ?? it.createAt ?? ''),
          updatedAt: String(it.updatedAt ?? it.updateAt ?? ''),
          user: { nickname: String(it.nickname ?? it.user?.nickname ?? '') },
          isMine: Boolean(it.isMine),
          status: it.status === 'BLIND' ? 'BLINDED' : 'DISPLAY',
        }));

        setReviews(mapped);
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err);
        setReviews([]);
      }
    })();
  }, [courseId, mode]);

  const myReview = useMemo(() => reviews.find((r) => r.isMine), [reviews]);

  const myReviewStatus: MyReviewStatus = useMemo(() => {
    if (!myReview) return { status: 'none' };
    return { status: 'exists', reviewId: myReview.id };
  }, [myReview]);

  const canWriteReview = myReviewStatus.status === 'none';

  const createReview = useCallback(
    async (payload: CreateReviewRequest) => {
      const now = new Date().toISOString();

      // DEV: mock optimistic
      const newReview: Review = {
        id: globalThis.crypto?.randomUUID?.() ?? `rev_${Date.now()}`,
        courseId,
        nickname: 'me',
        rating: payload.rating ?? 0,
        content: payload.content?.trim() ?? '',
        createdAt: now,
        updatedAt: now,
        user: { nickname: 'me' },
        isMine: true,
        status: 'DISPLAY',
      };

      setReviews((prev) => [newReview, ...prev.map((r) => ({ ...r, isMine: false }))]);

      /**
       * TODO: 리뷰 생성 API
       * await createReviewApi(courseId, payload);
       * await refresh(=재조회) 하고 싶으면, 여기서 mode 기준으로 다시 fetch 하면 됨
       */

      return newReview;
    },
    [courseId],
  );

  const updateReview = useCallback(async (reviewId: string, payload: UpdateReviewRequest) => {
    const now = new Date().toISOString();

    let updated: Review | null = null;

    setReviews((prev) =>
      prev.map((review) => {
        if (review.id !== reviewId) return review;

        updated = {
          ...review,
          rating: payload.rating ?? review.rating,
          content: payload.content?.trim() ?? review.content,
          updatedAt: now,
          isMine: true,
        };

        return updated;
      }),
    );

    /**
     * TODO: 리뷰 수정 API
     * await updateReviewApi(reviewId, payload);
     */

    return updated;
  }, []);

  const deleteReview = useCallback(async (reviewId: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));

    /**
     * TODO: 리뷰 삭제 API
     * await deleteReviewApi(reviewId);
     */
  }, []);

  return {
    reviews,
    myReview,
    myReviewStatus,
    canWriteReview,
    createReview,
    updateReview,
    deleteReview,
  };
}
