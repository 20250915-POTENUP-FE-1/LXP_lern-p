'use client';

import type { Course } from '../types/course';
import type { User } from '../types/course';
import styles from './CourseApplyModal.module.css';
import { Modal } from '@/shared/ui/Modal';

export type CourseApplyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  course: Course & { totalLectures?: number };
  user: User | null;
  isEnrolled: boolean;
  applying: boolean;
  onApply: () => Promise<void>;
};

export const CourseApplyModal = ({
  isOpen,
  onClose,
  course,
  user,
  isEnrolled,
  applying,
  onApply,
}: CourseApplyModalProps) => {
  if (!isOpen || !course) return null;

  const handleConfirm = async () => {
    await onApply();
    onClose();
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
            <span className={styles['modal__value']}>{course.price}원</span>
          </li>
        </ul>
      </div>

      {!user && <p className={styles.notice}>수강 신청을 위해 로그인이 필요합니다.</p>}

      {user && isEnrolled && <p className={styles.notice}>이미 수강중인 강좌입니다.</p>}

      <footer className="modal__actions">
        <button
          type="button"
          className="modal__button"
          onClick={handleConfirm}
          disabled={!user || isEnrolled || applying}
        >
          {applying ? '신청 중...' : isEnrolled ? '수강중' : '신청하기'}
        </button>
      </footer>
    </Modal>
  );
};
