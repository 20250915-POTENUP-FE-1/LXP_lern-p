'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import styles from '@/app/(user)/mypage/MyPageSections.module.css';
// TODO: 임시 목업 데이터
// import { getEnrollmentList } from '@/domains/user/services/enrollmentService';
import type { EnrollmentListContent } from '@/domains/user/types/enrollment';
import { MOCK_ENROLLMENT_LIST } from '@/mocks/enrollmentList.mock';
import CourseReviewModal from '@/domains/course/components/CourseReviewModal';
import { MOCK_GET_COURSE_REVIEWS } from '@/mocks/review.mock';
import { useCourseReviews } from '@/domains/course/hooks/useCourseReview';
// import { getIsReviewed } from '@/domains/course/services/reviewService';

export default function EnrollmentClientPage() {
  const [items, setItems] = useState<EnrollmentListContent[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewTarget, setReviewTarget] = useState<EnrollmentListContent | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const selectedCourseId = useMemo(
    () => (reviewTarget ? String(reviewTarget.courseId) : ''),
    [reviewTarget],
  );

  const { myReview, myReviewStatus, canWriteReview, createReview, updateReview } = useCourseReviews(
    { courseId: selectedCourseId, mode: 'mine' } as any,
  );

  const modalIsMine = myReviewStatus.status === 'exists';

  const initialReview = useMemo(() => {
    if (!isReviewOpen) return undefined;
    if (myReviewStatus.status !== 'exists') return undefined;
    if (!myReview) return undefined;
    return { rating: myReview.rating, content: myReview.content };
  }, [isReviewOpen, myReviewStatus.status, myReview]);

  const openReviewModal = (item: EnrollmentListContent) => {
    setReviewTarget(item);
    setIsReviewOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewOpen(false);
    setReviewTarget(null);
  };

  const submitReview = async (payload: { rating: number; content: string }) => {
    if (!reviewTarget) return;
    const courseId = String(reviewTarget.courseId);

    try {
      if (canWriteReview) {
        await createReview({
          rating: payload.rating,
          content: payload.content,
        });

        setItems((prev) =>
          prev.map((it) => (String(it.courseId) === courseId ? { ...it, isReviewed: true } : it)),
        );
      } else if (myReviewStatus.status === 'exists') {
        await updateReview(myReviewStatus.reviewId, {
          rating: payload.rating,
          content: payload.content,
        });
      }

      closeReviewModal();
    } catch (e) {
      console.error('리뷰 제출 실패:', e);
    }
  };

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const page = MOCK_ENROLLMENT_LIST; // TODO: getEnrollmentList로 교체
        const content = page.content;

        /**
         * ===============================
         * DEV: mock 리뷰 기준 isReviewed 계산 (isMine 사용)
         * ===============================
         */
        const merged = content.map((it) => {
          const courseId = String(it.courseId);
          const list = MOCK_GET_COURSE_REVIEWS[courseId] ?? [];

          const hasMine = list.some((r: any) => Boolean(r.isMine));

          return {
            ...it,
            isReviewed: hasMine,
          };
        });

        setItems(merged);

        /**
         * ===============================
         * PROD: API 기준 isReviewed 계산
         * (연동 시 위 mock 로직 제거)
         * ===============================
         */
        /*
        const courseIds = Array.from(
          new Set(
            content
              .map((it) => Number(it.courseId))
              .filter((v) => Number.isFinite(v)),
          ),
        );

        if (courseIds.length === 0) {
          setItems(content.map((it) => ({ ...it, isReviewed: false })));
          return;
        }

        const flags = await getIsReviewed(
          courseIds.map((courseId) => ({ courseId })),
        );

        const map = new Map(
          flags.map((f) => [String(f.courseId), !!f.isReviewed]),
        );

        const merged = content.map((it) => ({
          ...it,
          isReviewed: map.get(String(it.courseId)) ?? false,
        }));

        setItems(merged);
        */
      } catch (e) {
        console.error('수강 목록 조회 실패:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchEnrollments();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px' }}>⏳ 내 수강 강좌 불러오는 중...</div>;
  }

  if (items.length === 0) {
    return <div style={{ padding: '40px' }}>🫠 수강 중인 강의가 없어요.</div>;
  }

  return (
    <article className={styles['enrollment-section']} aria-labelledby="mypage-enrollment-title">
      <h1 id="mypage-enrollment-title" className={styles['enrollment-section__title']}>
        수강 중인 강좌
      </h1>

      <div className={styles['enrollment-section__list']}>
        {items.map((item) => {
          const hasProgress = (item.progressRate ?? 0) > 0;

          return (
            <div key={item.enrollmentId} className={styles['enrollment-card']}>
              <div className={styles['enrollment__link']}>
                <div className={styles['enrollment__text']}>
                  <div className={styles['enrollment__header']}>
                    <h3 className={styles['enrollment__title']}>{item.courseName}</h3>
                    <button
                      type="button"
                      className={styles['enrollment__review-btn']}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openReviewModal(item);
                      }}
                    >
                      {item.isReviewed ? '리뷰 수정' : '리뷰 작성'}
                    </button>
                  </div>

                  <p className={styles['enrollment__category']}>
                    {item.categories?.join(' / ') ?? '카테고리 없음'}
                  </p>
                </div>

                <div className={styles['enrollment-card__actions']}>
                  <Link
                    href={`/courses/${item.courseId}/learn?enrollmentId=${item.enrollmentId}&start=first`}
                    className={styles['btn-secondary']}
                  >
                    처음부터
                  </Link>

                  {hasProgress && (
                    <Link
                      href={`/courses/${item.courseId}/learn?enrollmentId=${item.enrollmentId}`}
                      className={styles['btn-primary']}
                    >
                      이어보기
                    </Link>
                  )}
                </div>
              </div>

              <div className={styles['progress']} aria-label={`${item.progressRate ?? 0}%`}>
                <div
                  className={styles['progress__bar']}
                  style={{ width: `${item.progressRate ?? 0}%` }}
                />
              </div>

              <span
                className={styles['enrollment-card__percent']}
              >{`${item.progressRate ?? 0}%`}</span>
            </div>
          );
        })}
      </div>

      <CourseReviewModal
        isOpen={isReviewOpen}
        isMine={modalIsMine}
        nickname={myReview?.nickname ?? ''}
        initialReview={initialReview}
        onClose={closeReviewModal}
        onSubmit={submitReview}
      />
    </article>
  );
}
