'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import styles from '@/app/(user)/mypage/MyPageSections.module.css';
import type { EnrollmentListContent } from '@/domains/user/types/enrollment';
import { MOCK_ENROLLMENT_LIST } from '@/mocks/enrollmentList.mock';
import CourseReviewModal from '@/domains/course/components/CourseReviewModal';
import { MOCK_GET_COURSE_REVIEWS } from '@/mocks/review.mock';
import { useCourseReviews } from '@/domains/course/hooks/useCourseReview';
import { USE_MOCK } from '@/shared/constants/config';
import { getIsReviewed } from '@/domains/course/services/reviewService';
import { getEnrollmentList } from '../services/enrollmentService';
import { getEnrollmentProgressRate } from '../utils/enrollmentProgress';

export default function EnrollmentClientPage() {
  const [items, setItems] = useState<EnrollmentListContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<EnrollmentListContent | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const router = useRouter();

  const selectedCourseId = useMemo(
    () => (reviewTarget ? String(reviewTarget.courseId) : ''),
    [reviewTarget],
  );

  const { myReview, myReviewStatus, canWriteReview, writeReview, editReview } = useCourseReviews(
    selectedCourseId,
    { fetchAll: false },
  );

  const isReviewed = myReviewStatus.status === 'exists';

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
  };

  const submitReview = async (payload: { rating: number; content: string }) => {
    if (!reviewTarget) return;
    const courseId = String(reviewTarget.courseId);

    try {
      if (canWriteReview) {
        await writeReview({
          rating: payload.rating,
          content: payload.content,
        });

        setItems((prev) =>
          prev.map((it) => (String(it.courseId) === courseId ? { ...it, isReviewed: true } : it)),
        );
      } else if (myReviewStatus.status === 'exists') {
        await editReview({
          rating: payload.rating,
          content: payload.content,
        });
      }

      closeReviewModal();
      router.push(`/courses/${courseId}/?tab=review#reviews`);
    } catch (e) {
      console.error('리뷰 제출 실패:', e);
    }
  };

  useEffect(() => {
    async function fetchEnrollments() {
      setLoading(true);
      try {
        // TODO(mock): 개발 중 환경변수로 수강 목록 및 리뷰 상태를 mock 데이터로 구성
        const page = USE_MOCK ? MOCK_ENROLLMENT_LIST : await getEnrollmentList();
        const content = page.content;

        if (USE_MOCK) {
          const merged = content.map((it) => {
            const list = MOCK_GET_COURSE_REVIEWS.content ?? [];
            const hasMine = list.some((r) => Boolean(r.isMine));

            return { ...it, isReviewed: hasMine };
          });

          setItems(merged);
          return;
        }

        const courseIds = Array.from(
          new Set(content.map((it) => Number(it.courseId)).filter((v) => Number.isFinite(v))),
        );
        const flags = await getIsReviewed({ courseIds });
        const reviewedMap = new Map(flags.map((f) => [String(f.courseId), !!f.isReviewed]));
        const merged = content.map((it) => ({
          ...it,
          isReviewed: reviewedMap.get(String(it.courseId)) ?? false,
        }));

        setItems(merged);
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
          const rate = getEnrollmentProgressRate(item);
          const canLearn = item.status === 'ENROLLED' || item.status === 'COMPLETED';
          const canReview = item.status === 'ENROLLED';

          return (
            <div key={item.enrollmentId} className={styles['enrollment-card']}>
              <div className={styles['enrollment__link']}>
                <div className={styles['enrollment__text']}>
                  <div className={styles['enrollment__header']}>
                    <Link href={`/courses/${item.courseId}`}>
                      <h3 className={styles['enrollment__title']}>{item.courseName}</h3>
                    </Link>
                  </div>

                  <p className={styles['enrollment__category']}>
                    {item.categories?.join(' / ') ?? '카테고리 없음'}
                  </p>
                </div>

                <div className={styles['enrollment-card__actions']}>
                  {canReview && (
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
                  )}
                  {canLearn && (
                    <Link
                      href={`/courses/${item.courseId}/learn?enrollmentId=${item.enrollmentId}`}
                      className={styles['btn-primary']}
                      aria-label="학습하기"
                    >
                      <Play />
                    </Link>
                  )}
                </div>
              </div>

              <div className={styles['progress']}>
                <div className={styles['progress__bar']} style={{ width: `${rate}%` }} />
              </div>

              <span className={styles['enrollment-card__percent']}>{rate}%</span>
            </div>
          );
        })}
      </div>

      <CourseReviewModal
        isOpen={isReviewOpen}
        isMine={isReviewed}
        nickname={myReview?.nickname ?? ''}
        initialReview={initialReview}
        onClose={closeReviewModal}
        onSubmit={submitReview}
      />
    </article>
  );
}
