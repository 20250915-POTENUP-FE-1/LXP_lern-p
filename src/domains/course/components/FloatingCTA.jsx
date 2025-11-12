import styles from './FloatingCTA.module.css';

export function FloatingCTA({
  price,
  isFree,
  isEnrolled,
  instructorName,
  totalLectures,
  totalTime,
  level,
  onApply, // 이거 추가
  onAddToCart,
}) {
  return (
    <aside className={styles['floating-cta']} aria-label="강좌 신청 플로팅 영역">
      <div className={styles['floating-cta__panel']}>
        {/* 상단: 가격 */}
        <div className={styles['floating-cta__price']}>
          <strong className={styles['floating-cta__price-value']}>
            {isFree ? '무료' : `₩${price?.toLocaleString() ?? 0}`}
          </strong>
          {!isFree && <span className={styles['floating-cta__price-note']}>일시 결제</span>}
        </div>

        {/* 버튼 그룹 */}
        <div className={styles['floating-cta__actions']}>
          <button
            type="button"
            className={`${styles['floating-cta__button']} ${
              isEnrolled ? styles['floating-cta__button--disabled'] : ''
            }`}
            onClick={onApply}
            disabled={isEnrolled}
          >
            {isEnrolled ? '수강중' : '수강신청하기'}
          </button>

          {/* 장바구니 버튼 */}
          <button type="button" className={styles['floating-cta__secondary']} onClick={onAddToCart}>
            장바구니 담기
          </button>
        </div>

        {/* 하단 메타 정보 */}
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
            <span className={styles['floating-cta__meta-value']}>{level ?? '초급'}</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
