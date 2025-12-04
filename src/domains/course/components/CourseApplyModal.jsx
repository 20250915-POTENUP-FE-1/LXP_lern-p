import { useNavigate } from 'react-router';
import { Modal } from '@/shared/ui/Modal';
import styles from './CourseApplyModal.module.css';

/**
 * 강좌 신청 확인 모달
 * - 상태는 상위(CourseDetailPage)에서 props로 전달받음
 */
export function CourseApplyModal({ isOpen, onClose, course, user, isEnrolled, applying, onApply }) {
  const navigate = useNavigate();

  if (!isOpen || !course) return null;

  const priceLabel = course.isFree
    ? '무료'
    : course.price
      ? `₩${Number(course.price).toLocaleString()}`
      : '—';

  const handleApplyCourse = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      onClose();
      return;
    }

    try {
      await onApply();
      onClose();
    } catch (error) {
      console.error(error.message ?? '수강 신청에 실패했습니다.');
      navigate('/');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className="modal__header">
        <h2 id="course-apply-title" className="modal__title">
          강좌 신청 확인
        </h2>
        <button type="button" className="modal__close" aria-label="닫기" onClick={onClose}>
          ×
        </button>
      </header>

      <div className={styles['modal__body']}>
        <ul className={styles['course-apply__list']}>
          <li className={styles['modal__field']}>
            <span className={styles['modal__label']}>강좌명</span>
            <span className={styles['modal__value']}>{course.title ?? '—'}</span>
          </li>
          <li className={styles['modal__field']}>
            <span className={styles['modal__label']}>요약</span>
            <span className={styles['modal__value']}>{course.summary ?? '—'}</span>
          </li>
          <li className={styles['modal__field']}>
            <span className={styles['modal__label']}>강사명</span>
            <span className={styles['modal__value']}>{course.instructorName ?? '—'}</span>
          </li>
          <li className={styles['modal__field']}>
            <span className={styles['modal__label']}>커리큘럼</span>
            <span className={styles['modal__value']}>총 {course.totalLectures ?? 0}강</span>
          </li>
          <li className={styles['modal__field']}>
            <span className={styles['modal__label']}>총 시간</span>
            <span className={styles['modal__value']}>{course.duration ?? 0}분</span>
          </li>
          <li className={styles['modal__field']}>
            <span className={styles['modal__label']}>난이도</span>
            <span className="modal__value">{course.level ?? '—'}</span>
          </li>
          <li className={styles['modal__field']}>
            <span className={styles['modal__label']}>결제</span>
            <span className={styles['modal__value']}>{priceLabel}</span>
          </li>
        </ul>
      </div>

      <footer className="modal__actions">
        <button
          type="button"
          className="modal__button"
          onClick={handleApplyCourse}
          disabled={applying || isEnrolled}
        >
          {isEnrolled ? '수강 중' : course.isFree ? '신청하기' : '수강 신청'}
        </button>
      </footer>
    </Modal>
  );
}
