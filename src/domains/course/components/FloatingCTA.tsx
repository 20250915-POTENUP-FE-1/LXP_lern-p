// src/domains/course/components/FloatingCTA.tsx
'use client'

import type { FloatingCTAProps } from '../types/types'
import styles from './FloatingCTA.module.css'

export const FloatingCTA = ({
  price,
  isFree,
  isEnrolled,
  onApply,
  isOwner,
  instructorName,
  totalLectures,
  totalTime,
  level,
  onAddToCart,
}: FloatingCTAProps) => {
  // 버튼 라벨 분기
  const primaryLabel = isOwner ? '내 강의 관리' : isEnrolled ? '수강중 / 학습하기' : '수강신청하기'

  const isPrimaryDisabled = isOwner // 필요에 따라 조정

  return (
    <aside className={styles['floating-cta']}>
      <div className={styles['floating-cta__card']}>
        {/* 가격 영역 */}
        <div className={styles['floating-cta__price']}>
          {isFree ? (
            <span className={styles['floating-cta__price-free']}>무료 강의</span>
          ) : (
            <span className={styles['floating-cta__price-value']}>{price.toLocaleString()}원</span>
          )}
        </div>

        {/* 메타 정보 */}
        <div className={styles['floating-cta__meta']}>
          <p className={styles['floating-cta__instructor']}>{instructorName} 강사</p>
          <p className={styles['floating-cta__info']}>
            강의 {totalLectures}개 · {totalTime} · {level}
          </p>
        </div>

        {/* 주요 CTA 버튼 */}
        <button
          type="button"
          className={styles['floating-cta__primary']}
          onClick={onApply}
          disabled={isPrimaryDisabled}
        >
          {primaryLabel}
        </button>

        {/* 선택: 장바구니 버튼 */}
        {!isFree && !isEnrolled && !isOwner && onAddToCart && (
          <button type="button" className={styles['floating-cta__secondary']} onClick={onAddToCart}>
            장바구니 담기
          </button>
        )}
      </div>
    </aside>
  )
}
