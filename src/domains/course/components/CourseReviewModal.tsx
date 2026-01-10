'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import styles from './CourseReviewModal.module.css';

export type CourseReviewModalProps = {
  isOpen: boolean;
  nickname: string;
  onClose: () => void;
  onSubmit: (payload: { rating: number; content: string }) => void;
};

export default function CourseReviewModal({
  isOpen,
  nickname,
  onClose,
  onSubmit,
}: CourseReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const maxLength = 500;
  const minLength = 10;

  useEffect(() => {
    if (!isOpen) return;
    setRating(0);
    setContent('');
    setFocused(false);
    setSubmitted(false);
  }, [isOpen]);

  const ratingError = submitted && rating === 0;
  const contentError =
    submitted && (content.trim().length < minLength || content.trim().length > maxLength);

  const handleSubmit = () => {
    setSubmitted(true);
    if (rating === 0) return;
    if (content.trim().length < minLength) return;

    onSubmit({ rating, content: content.trim() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className="modal__header">
        <h2 className="modal__title">힘이 되는 수강평을 남겨주세요!</h2>

        <button className="modal__close" onClick={onClose} aria-label="닫기">
          ×
        </button>
      </header>

      <div className="modal__body">
        <section className={styles['review-modal']}>
          <div className={styles['review-modal__stars']}>
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                className={[
                  styles['review-modal__star'],
                  v <= rating
                    ? styles['review-modal__star--active']
                    : styles['review-modal__star--inactive'],
                ].join(' ')}
                onClick={() => {
                  setRating((prev) => (prev === v ? 0 : v));
                }}
                aria-label={`${v}점`}
              >
                ★
              </button>
            ))}
          </div>

          {ratingError && <p className="modal__error-text">별점을 선택해주세요.</p>}

          <div
            className={[
              styles['review-modal__field'],
              focused ? styles['review-modal__field--focus'] : '',
            ].join(' ')}
          >
            <div className={styles['review-modal__textarea-wrap']}>
              <textarea
                className={[
                  styles['review-modal__textarea'],
                  contentError ? styles['review-modal__textarea--invalid'] : '',
                ].join(' ')}
                placeholder="수강평을 작성해보세요!"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                maxLength={maxLength}
              />
              <div className={styles['review-modal__count-float']}>
                {content.length} / {maxLength}
              </div>
            </div>
          </div>

          {contentError && (
            <p className="modal__error-text">최소 {minLength}자 이상 작성해주세요.</p>
          )}
        </section>
      </div>

      <footer className={styles['review-modal__footer']}>
        <button type="button" className={styles['review-modal__button--cancel']} onClick={onClose}>
          취소
        </button>

        <button
          type="button"
          className={[
            styles['review-modal__button--submit'],
            contentError || rating === 0
              ? styles['review-modal__button--submit--idle']
              : styles['review-modal__button--submit--ready'],
          ].join(' ')}
          onClick={handleSubmit}
        >
          등록
        </button>
      </footer>
    </Modal>
  );
}
