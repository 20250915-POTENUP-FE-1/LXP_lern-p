'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from '@/app/(user)/mypage/MyPageSections.module.css';
// TODO: 임시 목업 데이터
import { getEnrollmentList } from '@/domains/user/services/enrollmentService';
import { createReview, getMyReview, updateReview } from '@/domains/course/services/reviewService';
import type { EnrollmentListContent } from '@/domains/user/types/enrollment';
import { MOCK_ENROLLMENT_LIST } from '@/mocks/enrollmentList.mock';
import CourseReviewModal from '@/domains/course/components/CourseReviewModal';
import { getUserProfile } from '../services/userService';
import { MOCK_GET_COURSE_REVIEWS } from '@/mocks/review.mock';
import { useRouter } from 'next/navigation';

export default function EnrollmentClientPage() {
  const [items, setItems] = useState<EnrollmentListContent[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewTarget, setReviewTarget] = useState<EnrollmentListContent | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [initialReview, setInitialReview] = useState<
    { rating: number; content: string } | undefined
  >(undefined);
  const [modalIsMine, setModalIsMine] = useState(false);

  const [nickname, setNickname] = useState<string>('');
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();

  const openReviewModal = async (item: EnrollmentListContent) => {
    setReviewTarget(item);
    setIsReviewOpen(true);

    if (!item.isReviewed) {
      setModalIsMine(false);
      setInitialReview(undefined);
      return;
    }

    setModalIsMine(true);
    try {
      const courseId = item.courseId;
      const list = MOCK_GET_COURSE_REVIEWS[courseId] ?? [];
      const mine = list.find((r) => r.nickname === nickname);
      if (!mine) {
        throw new Error('내 리뷰가 없음');
      }

      setInitialReview({ rating: mine.rating, content: mine.content });
    } catch (e) {
      console.error('내 리뷰 조회 실패:', e);
      setModalIsMine(false);
      setInitialReview(undefined);
    } finally {
    }
  };

  const submitReview = async (payload: { rating: number; content: string }) => {
    const closeReviewModal = () => {
      setIsReviewOpen(false);
      setInitialReview(undefined);
      setReviewTarget(null);
      setModalIsMine(false);
    };

    if (!reviewTarget) return;
    const courseId = String(reviewTarget.courseId);
    const now = new Date().toISOString();

    try {
      const list = (MOCK_GET_COURSE_REVIEWS[courseId] ??= []);

      const idx = list.findIndex((r) => r.nickname === nickname);

      const upsertMyReview = () => {
        const idx = list.findIndex((r) => r.nickname === nickname);

        if (idx >= 0) {
          list[idx] = {
            ...list[idx],
            rating: payload.rating,
            content: payload.content,
            updatedAt: now,
          };
          // TODO: updatedReview API 연동
          /*
           * await updateReview(courseId, {
           *   rating: payload.rating,
           *   content: payload.content,
           * });
           */
          return;
        }

        list.unshift({
          id: String(Date.now()),
          userId: 'me',
          nickname,
          courseId,
          rating: payload.rating,
          content: payload.content,
          status: 'DISPLAY',
          reported: 0,
          createdAt: now,
          updatedAt: now,
        });

        setItems((prev) =>
          prev.map((it) => (String(it.courseId) === courseId ? { ...it, isReviewed: true } : it)),
        );

        // TODO: createReview API 연동
        /*
         * await createReview(courseId, {
         *   rating: payload.rating,
         *   content: payload.content,
         * });
         * setItems((prev) =>
         *   prev.map((it) =>
         *     String(it.courseId) === courseId ? { ...it, isReviewed: true } : it,
         *   ),
         * );
         */
      };

      upsertMyReview();
      router.push(`/courses/${courseId}?tab=review`);
      closeReviewModal();
    } catch (e) {
      console.error('리뷰 제출 실패:', e);
    }
  };

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const user = await getUserProfile();
        setNickname(user.nickname);
      } catch (e) {
        console.error('유저 정보 조회 실패:', e);
        setNickname('');
      } finally {
        setUserLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        // TODO: 임시 목업 데이터
        // const page = await getEnrollmentList({
        //   status: 'ENROLLED',
        //   page: 0,
        //   size: 10,
        // });
        const page = MOCK_ENROLLMENT_LIST;

        setItems(page.content);
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openReviewModal(item);
                      }}
                      disabled={!nickname || userLoading}
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
        nickname={nickname}
        initialReview={initialReview}
        onClose={() => {
          setIsReviewOpen(false);
          setReviewTarget(null);
          setInitialReview(undefined);
          setModalIsMine(false);
        }}
        onSubmit={submitReview}
      />
    </article>
  );
}
