'use client';

import { MouseEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useModal } from '@/shared/hooks/useModal';
import { LoginModal } from '@/domains/auth/components/LoginModal';
import { CourseApplyModal } from '@/domains/course/components/CourseApplyModal';
import { FloatingCTA } from '@/domains/course/components/FloatingCTA';
import { useCourseApply } from '@/domains/course/hooks/useCourseApply';
import { useCourseDetail } from '@/domains/course/hooks/useCourseDetail';
import { formatDuration } from '@/domains/course/utils/formatDuration';
import styles from '@/app/courses/[id]/CourseDetailPage.module.css';
import { MOCK_GET_CART } from '@/mocks/cart.mock';
import { addCartItem } from '@/domains/cart/services/cartService';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { USE_MOCK } from '@/shared/constants/config';
import type { Section, Lecture } from '../types/course';
import { LEVEL_LABEL } from '../constants/level';
import { formatAbsoluteUrl } from '../utils/formatAbsoluteUrl';
import CoursePreviewModal from '../components/CoursePreviewModal';
import CourseReviewModal from '../components/CourseReviewModal';
import { useCourseReviews } from '../hooks/useCourseReview';
import { StarRating } from '../components/StarRating';
import { formatReviewDate } from '../utils/formatReviewDate';

type TabKey = 'intro' | 'curriculum' | 'reviews';

export type CourseDetailClientPageProps = {
  courseId: string;
};

export default function CourseDetailClientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { user, setUser } = useAuthState();

  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') === 'review' ? 'reviews' : 'curriculum') as TabKey;
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [cartPending, setCartPending] = useState(false);

  const loginModal = useModal(false);
  const applyModal = useModal(false);

  const { course, sections, lectures, loading } = useCourseDetail(id);
  const { isEnrolled, applying, handleApply } = useCourseApply(user, id);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [initialSelectedLectureId, setInitialSelectedLectureId] = useState<string | undefined>(
    undefined,
  );
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { reviews, writeReview, editReview, removeReview, myReviewStatus } = useCourseReviews(id);
  const reviewCount = reviews.length;

  const myReview = useMemo(() => reviews.find((r) => r.isMine), [reviews]);
  const hasMyReview = myReviewStatus.status === 'exists';

  const avgRating = useMemo(() => {
    if (reviewCount === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviewCount) * 10) / 10; // 소수점 1자리
  }, [reviews, reviewCount]);

  const isInCart = !!user?.cart?.includes(id);

  const canOpenReviewModal = !user || (isEnrolled && !hasMyReview);
  const reviewButtonLabel = !user
    ? '리뷰 등록하기'
    : !isEnrolled
      ? '수강 후 작성 가능'
      : hasMyReview
        ? '리뷰 등록 완료'
        : '리뷰 등록하기';

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (!course) {
    return <div className={styles.error}>강좌를 찾을 수 없습니다</div>;
  }

  const handleTabClick = (e: MouseEvent<HTMLAnchorElement>, tabId: TabKey) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  const handleApplyClick = () => {
    if (!course) return;
    if (!user) {
      loginModal.open();
      return;
    }
    if (course.isFree) {
      applyModal.open();
      return;
    }
    router.push(isEnrolled ? `/courses/${id}/learn` : `/cart?courseId=${id}`);
  };

  const handleAddToCartClick = async () => {
    if (!user) {
      loginModal.open();
      return;
    }
    if (cartPending) return;

    if (isInCart) {
      const go = confirm('이미 장바구니에 담긴 강좌예요. 장바구니로 이동할까요?');
      if (go) router.push(`/cart?courseId=${id}`);
      return;
    }

    setCartPending(true);
    try {
      // TODO: API 정상화 후 제거 또는 MSW로 전환
      if (!USE_MOCK) {
        await addCartItem({ courseId: Number(id) });
      }
      setUser({
        ...user,
        cart: [...(user.cart ?? []), id],
      });
      // toast.success('장바구니에 담았어요');
      const go = confirm('장바구니에 담았어요. 장바구니로 이동할까요?');
      if (go) router.push(`/cart?courseId=${id}`);
    } catch {
      // toast.error('장바구니 담기에 실패했어요');
      alert('장바구니 담기에 실패했어요');
    } finally {
      setCartPending(false);
    }
  };

  const previewLectures = sections
    .flatMap((sec) => lectures[sec.id] ?? [])
    .filter((lec) => lec.isPreview && lec.resource?.resourceType === 'VIDEO');

  const totalLectures = sections.reduce(
    (sum: number, sec: Section) => sum + (lectures[sec.id]?.length || 0),
    0,
  );

  const courseInfo = { ...course, totalLectures };
  const isOwner = !!user && user.id === course.instructorId;

  return (
    <main className={`${styles['course-detail']} container`} aria-labelledby="course-detail-title">
      <div className={styles['course-detail__layout']}>
        <Image
          width={800}
          height={450}
          className={styles['course-detail__hero']}
          // TODO: 썸네일 임시 처리 - formatAbsoluteUrl(course.thumbnailUrl)
          src={'/default-thumbnail.png'}
          alt={`${course.title} 썸네일`}
          loading="lazy"
        />

        <article className={styles['course-detail__main']}>
          <header className={styles['course-detail__header']}>
            <h1 className={styles['course-detail__title']}>{course.title}</h1>
            <p className={styles['course-detail__instructor']}>{course.instructorName} 강사</p>

            {course.tags?.length > 0 && (
              <ul className={styles['course-detail__tags']}>
                {course.tags.map((tag: string, idx: number) => (
                  <li key={idx} className={styles['course-detail__tag']}>
                    #{tag}
                  </li>
                ))}
              </ul>
            )}

            <ul className={styles['course-detail__meta']}>
              <li className={styles['course-detail__meta-people']}>
                {course.studentCount ?? 0}명 수강중
              </li>
              <li>{LEVEL_LABEL[course.level]}</li>
            </ul>

            {course.summary && <p className={styles['course-detail__summary']}>{course.summary}</p>}
          </header>

          <nav className={styles['course-detail__course-tabs']}>
            <ul className={styles['course-detail__course-tabs__list']}>
              {[
                { key: 'curriculum' as TabKey, label: '커리큘럼' },
                { key: 'intro' as TabKey, label: '강좌 소개' },
                { key: 'reviews' as TabKey, label: `수강평` },
              ].map(({ key, label }) => {
                const isActive = activeTab === key;
                const shouldShowCount = key === 'reviews' && reviewCount > 0;

                return (
                  <li key={key}>
                    <Link
                      href={`#${key}`}
                      className={`${styles['course-detail__course-tabs__link']} ${isActive ? styles['active'] : ''}`}
                      onClick={(e) => handleTabClick(e, key)}
                    >
                      <span className={styles['course-detail__course-tabs__label']}>{label}</span>

                      {shouldShowCount && (
                        <span className={`${styles['course-detail__course-tabs__count']} `}>
                          {reviewCount}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {activeTab === 'curriculum' && (
            <section className={styles['course-detail__section']}>
              <h2 className={styles['course-detail__section-title']}>커리큘럼</h2>
              {sections.length === 0 ? (
                <p>커리큘럼이 없습니다</p>
              ) : (
                sections.map((sec: Section) => (
                  <details key={sec.id} open className={styles['course-detail__section-group']}>
                    <summary className={styles['course-detail__section-summary']}>
                      {sec.title}
                    </summary>
                    <ul className={styles['course-detail__lecture-list']}>
                      {lectures[sec.id]?.map((lec: Lecture) => {
                        const canPreview = lec.isPreview && lec.resource?.resourceType === 'VIDEO';

                        return (
                          <li key={lec.id}>
                            <div className={styles['course-detail__lecture-item']}>
                              <div className={styles['course-detail__lecture-row']}>
                                <div className={styles['course-detail__lecture-text']}>
                                  <span className={styles['course-detail__lecture-title']}>
                                    {lec.title}
                                  </span>
                                  <span className={styles['course-detail__lecture-meta']}>
                                    {lec.duration}분
                                  </span>
                                </div>
                                {canPreview ? (
                                  <button
                                    type="button"
                                    className={styles['course-detail__preview-btn']}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setInitialSelectedLectureId(lec.id);
                                      setIsPreviewOpen(true);
                                    }}
                                  >
                                    미리보기
                                  </button>
                                ) : (
                                  <span className={styles['course-detail__locked-pill']}>잠김</span>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                ))
              )}
            </section>
          )}

          {activeTab === 'intro' && (
            <section className={styles['course-detail__section']}>
              <h2 className={styles['course-detail__section-title']}>강좌 개요</h2>
              <p>{course.description || '강좌 개요는 추후 업데이트 예정입니다.'}</p>
            </section>
          )}
          {activeTab === 'reviews' && (
            <section className={styles['course-detail__section']}>
              <div className={styles['course-detail__section-head']}>
                <h2 className={styles['course-detail__section-title']}>수강평</h2>

                <button
                  type="button"
                  className={[
                    styles['course-detail__review-btn'],
                    !canOpenReviewModal ? styles['course-detail__review-btn--disabled'] : '',
                    !isEnrolled && user ? styles['course-detail__review-btn--enroll-required'] : '',
                  ].join(' ')}
                  disabled={!canOpenReviewModal}
                  onClick={() => {
                    if (!user) {
                      loginModal.open();
                      return;
                    }
                    if (!isEnrolled) return;
                    if (hasMyReview) return;

                    setIsReviewOpen(true);
                  }}
                >
                  {reviewButtonLabel}
                </button>
              </div>

              {reviewCount > 0 && (
                <div className={styles['course-detail__review-summary']}>
                  <div className={styles['course-detail__review-summary__inner']}>
                    <div className={styles['course-detail__review-summary__score']}>
                      {avgRating.toFixed(1)}
                    </div>

                    <div className={styles['course-detail__review-summary__stars']}>
                      <StarRating value={avgRating} />
                    </div>

                    <div className={styles['course-detail__review-summary__meta']}>
                      {reviewCount}개의 수강평
                    </div>
                  </div>
                </div>
              )}

              {reviews.length === 0 ? (
                <p>아직 리뷰가 없습니다.</p>
              ) : (
                <ul className={styles['course-detail__review-list']}>
                  {reviews.map((r) => (
                    <li
                      key={r.id}
                      className={[
                        styles['course-detail__review-card'],
                        r.isMine ? styles['course-detail__review-card--mine'] : '',
                      ].join(' ')}
                    >
                      <div className={styles['course-detail__review-card__author']}>
                        <span className={styles['course-detail__review-card__nickname']}>
                          {r.nickname}
                        </span>
                        <span className={styles['course-detail__review-card__date']}>
                          {formatReviewDate(r.createdAt)}
                        </span>
                        {r.isMine ? (
                          <div className={styles['course-detail__review-card__btn-group']}>
                            <button
                              type="button"
                              className={styles['course-detail__review-card__edit-btn']}
                              onClick={() => {
                                setIsReviewOpen(true);
                              }}
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              className={styles['course-detail__review-card__delete-btn']}
                              onClick={async () => {
                                if (myReviewStatus.status !== 'exists') return;
                                if (!confirm('정말 삭제할까요?')) return;
                                await removeReview();
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        ) : null}
                      </div>

                      <div className={styles['course-detail__review-card__header']}>
                        <div className={styles['course-detail__review-card__rating']}>
                          <StarRating value={r.rating} />
                        </div>

                        <p className={styles['course-detail__review-card__content']}>{r.content}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </article>

        <FloatingCTA
          price={course.price}
          isFree={course.isFree}
          isEnrolled={isEnrolled}
          isInCart={isInCart}
          cartPending={cartPending}
          onApply={handleApplyClick}
          onAddToCart={handleAddToCartClick}
          isOwner={isOwner}
          instructorName={course.instructorName}
          totalLectures={courseInfo.totalLectures}
          totalTime={formatDuration(course.duration)}
          level={course.level}
        />
      </div>
      {/* 모달들 */}
      <CourseReviewModal
        isOpen={isReviewOpen}
        nickname={user?.nickname ?? ''} // 모달 표시용
        isMine={hasMyReview}
        onClose={() => setIsReviewOpen(false)}
        initialReview={
          myReview ? { rating: myReview.rating, content: myReview.content } : undefined
        }
        onSubmit={async ({ rating, content }) => {
          try {
            if (myReviewStatus.status === 'exists') {
              await editReview({ rating, content });
            } else {
              await writeReview({ rating, content });
            }
            setIsReviewOpen(false);
          } catch (e) {
            console.error('리뷰 저장 실패:', e);
          }
        }}
      />
      <LoginModal isOpen={loginModal.isOpen} onClose={loginModal.close} />
      <CourseApplyModal
        isOpen={applyModal.isOpen}
        onClose={applyModal.close}
        course={courseInfo}
        user={user}
        isEnrolled={isEnrolled}
        applying={applying}
        onApply={handleApply}
      />
      <CoursePreviewModal
        isOpen={isPreviewOpen}
        lectures={previewLectures}
        initialSelectedLectureId={initialSelectedLectureId}
        onClose={() => setIsPreviewOpen(false)}
      />
    </main>
  );
}
