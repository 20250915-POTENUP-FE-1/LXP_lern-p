'use client';

import styles from '@/app/courses/[id]/FloatingCTA.module.css';
import { LEVEL_LABEL } from '../constants/level';
import { CourseLevel } from '../types/course';

export type FloatingCTAProps = {
  price: number;
  isFree: boolean;
  isEnrolled: boolean;
  isOwner: boolean;

  isInCart?: boolean;
  cartPending?: boolean;

  onApply: () => void;
  onAddToCart?: () => void;

  instructorName: string;
  totalLectures: number;
  totalTime: string;
  level: CourseLevel;
};

export const FloatingCTA = ({
  price,
  isFree,
  isEnrolled,
  isOwner,
  isInCart = false,
  cartPending = false,
  onApply,
  onAddToCart,
  instructorName,
  totalLectures,
  totalTime,
  level,
}: FloatingCTAProps) => {
  const primaryLabel = isOwner ? '내가 등록한 강좌' : isEnrolled ? '학습하기' : '수강신청하기';

  const showAddToCartButton = !isFree && !isEnrolled && !isOwner && !isInCart && !!onAddToCart;

  return (
    <aside className={styles['floating-cta']} aria-label="강좌 신청 플로팅 영역">
      <div className={styles['floating-cta__panel']}>
        <div className={styles['floating-cta__price']}>
          <strong className={styles['floating-cta__price-value']}>
            {isFree ? '무료' : `₩${price?.toLocaleString() ?? 0}`}
          </strong>
        </div>

        <div className={styles['floating-cta__actions']}>
          <button
            type="button"
            className={`${styles['floating-cta__button']} ${
              isOwner ? styles['floating-cta__button--disabled'] : ''
            }`}
            onClick={onApply}
            disabled={isOwner}
          >
            {primaryLabel}
          </button>

          {showAddToCartButton && (
            <button
              type="button"
              className={styles['floating-cta__secondary']}
              onClick={onAddToCart}
              disabled={cartPending}
              aria-disabled={cartPending}
            >
              장바구니 담기
            </button>
          )}
        </div>

        <ul className={styles['floating-cta__meta-list']}>
          <li className={styles['floating-cta__meta-row']}>
            <span className={styles['floating-cta__meta-label']}>강사</span>
            <span className={styles['floating-cta__meta-value']}>{instructorName ?? '미정'}</span>
          </li>

          <li className={styles['floating-cta__divider']} />

          <li className={styles['floating-cta__meta-row']}>
            <span className={styles['floating-cta__meta-label']}>총 강의</span>
            <span className={styles['floating-cta__meta-value']}>
              {totalLectures ? `${totalLectures}강` : '정보 없음'}
            </span>
          </li>

          <li className={styles['floating-cta__divider']} />

          <li className={styles['floating-cta__meta-row']}>
            <span className={styles['floating-cta__meta-label']}>총 시간</span>
            <span className={styles['floating-cta__meta-value']}>{totalTime ?? '5시간 20분'}</span>
          </li>

          <li className={styles['floating-cta__divider']} />

          <li className={styles['floating-cta__meta-row']}>
            <span className={styles['floating-cta__meta-label']}>난이도</span>
            <span className={styles['floating-cta__meta-value']}>{LEVEL_LABEL[level]}</span>
          </li>
        </ul>
      </div>
    </aside>
  );
};
