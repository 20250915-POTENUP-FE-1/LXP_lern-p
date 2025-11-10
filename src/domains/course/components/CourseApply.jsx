import { createPortal } from 'react-dom';
import styles from './CourseApply.module.css';

function CourseApply({
  open,
  course,
  totalLectures,
  totalMinutes,
  onCancel,
  onConfirm,
  isEnrolled,
}) {
  if (!open) return null;

  const fmtMinutes = (m) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return h > 0 ? `${h}시간  ${mm}분` : `${mm}분`;
  };
  return createPortal(
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal} role="document" aria-labelledby="enroll-title">
        <h3 id="enroll-title" className={styles.title}>
          강좌 신청 확인
        </h3>

        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span className={styles.label}>강좌</span>
            <span className={styles.value}>{course?.title}</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.label}>요약</span>
            <span className={styles.value}>{course?.summary ?? '—'}</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.label}>강사명</span>
            <span className={styles.value}>{course?.instructorName}</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.label}>커리큘럼</span>
            <span className={styles.value}>총 {totalLectures}강</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.label}>총 시간</span>
            <span className={styles.value}>{fmtMinutes(totalMinutes)}</span>
          </li>
          <li className={styles.listItem}>
            <span className={styles.label}>난이도</span>
            <span className={styles.value}>{course?.level}</span>
          </li>
        </ul>

        <div className={styles.actions}>
          {/* 💡 isEnrolled가 false일 때만 신청/결제 버튼 렌더링 */}

          <button type="button" className={styles.btnSecondary} onClick={onCancel}>
            취소
          </button>
          {!isEnrolled && (
            <button type="button" className={styles.btnPrimary} onClick={onConfirm}>
              신청{course?.isFree ? '' : ` / ₩${course.price?.toLocaleString()}`}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default CourseApply;
