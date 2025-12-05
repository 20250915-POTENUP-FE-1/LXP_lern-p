'use client';

import type { Course } from '../types/course';
import type { User } from '../types/course';
import styles from './CourseApplyModal.module.css';

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
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <h2 className={styles.title}>강좌 수강 신청</h2>

        <p className={styles.courseTitle}>{course.title}</p>
        <p className={styles.meta}>
          {course.instructorName} · 강의 {course.totalLectures ?? course.sections.length}개
        </p>

        {!user && <p className={styles.notice}>수강 신청을 위해 로그인이 필요합니다.</p>}

        {user && isEnrolled && <p className={styles.notice}>이미 수강중인 강좌입니다.</p>}

        {user && !isEnrolled && (
          <p className={styles.notice}>이 강좌를 수강 목록에 추가하시겠습니까?</p>
        )}

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.buttonSecondary}>
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!user || isEnrolled || applying}
            className={styles.buttonPrimary}
          >
            {applying ? '신청 중...' : isEnrolled ? '수강중' : '신청하기'}
          </button>
        </div>
      </div>
    </div>
  );
};
