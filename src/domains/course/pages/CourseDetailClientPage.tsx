'use client';

import { MouseEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/shared/hooks/useModal';
import { LoginModal } from '@/domains/auth/components/LoginModal';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { CourseApplyModal } from '@/domains/course/components/CourseApplyModal';
import { FloatingCTA } from '@/domains/course/components/FloatingCTA';
import { useCourseApply } from '@/domains/course/hooks/useCourseApply';
import { useCourseDetail } from '@/domains/course/hooks/useCourseDetail';
import { formatDuration } from '@/domains/course/utils/formatDuration';
import styles from '@/app/courses/[id]/CourseDetailPage.module.css';
import type { Section, Lecture, Review } from '../types/course';
import { LEVEL_LABEL } from '../constants/level';
import { formatAbsoluteUrl } from '../utils/formatAbsoluteUrl';
import CoursePreviewModal from '../components/CoursePreviewModal';
import CourseReviewModal from '../components/CourseReviewModal';
import { useCourseReviews } from '../hooks/useCourseReview';

type StarRatingProps = {
  value: number; // 1~5
};

function StarRating({ value }: StarRatingProps) {
  const filled = Math.round(value); // rating이 4.8 같은 값이어도 처리 가능
  return (
    <div className={styles['star-rating']} aria-label={`별점 ${value}점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={[
            styles['star'],
            i < filled ? styles['star--active'] : styles['star--inactive'],
          ].join(' ')}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

type TabKey = 'intro' | 'curriculum' | 'instructor' | 'reviews';

export type CourseDetailClientPageProps = {
  courseId: string;
};

export default function CourseDetailClientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { user, setUser } = useAuthState();

  const [activeTab, setActiveTab] = useState<TabKey>('intro');
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

  const initialReviews = useMemo<Review[]>(
    () => [
      {
        id: 'rev_001',
        courseId: id,
        rating: 5,
        content: '좋아요! React 기초가 깔끔하게 정리되어 있어서 따라가기 쉬웠어요.',
        createdAt: '2025-01-03T00:00:00Z',
        updatedAt: '2025-01-03T00:00:00Z',
        user: { nickname: '홍길동' },
        isMine: false,
        status: 'DISPLAY',
      },
    ],
    [id],
  );

  const { reviews, addReview, myReviewStatus, canWriteReview } = useCourseReviews(id, {
    nickname: user?.nickname,
    initialReviews,
  });
  function formatReviewDate(iso: string) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}. ${m}. ${day}.`;
  }

  const isInCart = !!user?.cart?.includes(id);

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
      // TODO: 장바구니 담기 API 연동 - await addToCart(...) 호출
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
          src={formatAbsoluteUrl(course.thumbnailUrl)}
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

          <nav className={styles['course-tabs']}>
            <ul className={styles['course-tabs__list']}>
              {[
                { key: 'intro' as TabKey, label: '강좌 소개' },
                { key: 'curriculum' as TabKey, label: '커리큘럼' },
                { key: 'instructor' as TabKey, label: '강사 정보' },
                { key: 'reviews' as TabKey, label: '수강 후기' },
              ].map(({ key, label }) => (
                <li key={key}>
                  <Link
                    href={`#${key}`}
                    className={`${styles['course-tabs__link']} ${
                      activeTab === key ? styles['active'] : ''
                    }`}
                    onClick={(e) => handleTabClick(e, key)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {activeTab === 'intro' && (
            <section className={styles['course-detail__section']}>
              <h2 className={styles['course-detail__section-title']}>강좌 개요</h2>
              <p>{course.description || '강좌 개요는 추후 업데이트 예정입니다.'}</p>
            </section>
          )}

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

          {activeTab === 'instructor' && (
            <section className={styles['course-detail__section']}>
              <h2 className={styles['course-detail__section-title']}>강사 정보</h2>
              <p>강사 소개는 추후 업데이트 예정입니다.</p>
            </section>
          )}
          {activeTab === 'reviews' && (
            <section className={styles['course-detail__section']}>
              <div className={styles['course-detail__section-head']}>
                <h2 className={styles['course-detail__section-title']}>수강 후기</h2>

                <button
                  type="button"
                  className={[
                    styles['course-detail__review-btn'],
                    !canWriteReview ? styles['course-detail__review-btn--disabled'] : '',
                  ].join(' ')}
                  disabled={!canWriteReview}
                  onClick={() => {
                    if (!user) {
                      loginModal.open();
                      return;
                    }
                    if (!canWriteReview) return;
                    setIsReviewOpen(true);
                  }}
                >
                  {canWriteReview ? '리뷰 등록하기' : '리뷰 등록 완료'}
                </button>
              </div>

              {reviews.length === 0 ? (
                <p>아직 리뷰가 없습니다.</p>
              ) : (
                <ul className={styles['review-list']}>
                  {reviews.map((r) => (
                    <li key={r.id} className={styles['review-card']}>
                      <div className={styles['review-card__header']}>
                        <div className={styles['review-card__author']}>
                          <span className={styles['review-card__nickname']}>{r.user.nickname}</span>
                          <span className={styles['review-card__date']}>
                            {formatReviewDate(r.createdAt)}
                          </span>
                        </div>

                        <div className={styles['review-card__rating']}>
                          <StarRating value={r.rating} />
                          <span className={styles['review-card__score']}>{r.rating} / 5</span>
                        </div>
                      </div>

                      <p className={styles['review-card__content']}>{r.content}</p>
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
        onClose={() => setIsReviewOpen(false)}
        nickname={user?.nickname ?? ''}
        onSubmit={async ({ rating, content }) => {
          await addReview({ rating, content });
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
