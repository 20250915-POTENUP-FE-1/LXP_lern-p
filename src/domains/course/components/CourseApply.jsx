import { createPortal } from 'react-dom';

function CourseApply({
  open,
  course,
  totalLectures = 0,
  duration,
  onCancel,
  onConfirm,
  isEnrolled,
  enrolling = false,
}) {
  if (!open) return null;

  const priceLabel = course?.isFree
    ? '무료'
    : course?.price != null
      ? `₩${Number(course.price).toLocaleString()}`
      : '—';

  return createPortal(
    <div className="modal">
      <div className="modal__overlay" onClick={onCancel} />
      <div className="modal__content" role="document">
        <div className="modal__header">
          <h3 id="enroll-title" className="modal__title">
            강좌 신청 확인
          </h3>
        </div>

        <div className="modal__body">
          <ul className="course-apply__list">
            <li className="course-apply__item">
              <span className="course-apply__label">강좌</span>
              <span className="course-apply__value">{course?.title ?? '—'}</span>
            </li>
            <li className="course-apply__item">
              <span className="course-apply__label">요약</span>
              <span className="course-apply__value">{course?.summary ?? '—'}</span>
            </li>
            <li className="course-apply__item">
              <span className="course-apply__label">강사명</span>
              <span className="course-apply__value">{course?.instructorName ?? '—'}</span>
            </li>
            <li className="course-apply__item">
              <span className="course-apply__label">커리큘럼</span>
              <span className="course-apply__value">총 {totalLectures}강</span>
            </li>
            <li className="course-apply__item">
              <span className="course-apply__label">총 시간</span>
              <span className="course-apply__value">{duration}분</span>
            </li>
            <li className="course-apply__item">
              <span className="course-apply__label">난이도</span>
              <span className="course-apply__value">{course?.level ?? '—'}</span>
            </li>
            <li className="course-apply__item">
              <span className="course-apply__label">결제</span>
              <span className="course-apply__value">{priceLabel}</span>
            </li>
          </ul>
        </div>

        <div className="modal__actions">
          <button
            type="button"
            className="modal__button modal__button--ghost"
            onClick={onCancel}
            disabled={enrolling}
          >
            취소
          </button>

          {!isEnrolled && (
            <button
              type="button"
              className="modal__button"
              onClick={onConfirm}
              disabled={enrolling}
              aria-busy={enrolling ? 'true' : undefined}
            >
              {course?.isFree ? '신청하기' : `신청 `}
            </button>
          )}

          {isEnrolled && (
            <button
              type="button"
              className="modal__button"
              disabled
              aria-disabled="true"
              title="이미 수강 중인 강좌입니다"
            >
              수강 중
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default CourseApply;
