'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import styles from './CourseReviewModal.module.css';

export type CourseReviewModalProps = {
  isOpen: boolean;
  nickname: string;
  isMine?: boolean;
  initialReview?: { rating: number; content: string };

  onClose: () => void;
  onSubmit: (payload: { rating: number; content: string }) => void;
};

export default function CourseReviewModal({
  isOpen,
  nickname,
  isMine,
  initialReview,
  onClose,
  onSubmit,
}: CourseReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const maxLength = 500;
  const minLength = 10;

  const isValid =
    rating > 0 && content.trim().length >= minLength && content.trim().length <= maxLength;

  const showLengthHint = focused && content.trim().length > 0 && content.trim().length < minLength;

  useEffect(() => {
    if (!isOpen) return;
    if (isMine && initialReview) {
      setRating(initialReview.rating);
      setContent(initialReview.content);
    } else {
      setRating(0);
      setContent('');
    }

    setFocused(false);
    setSubmitted(false);
  }, [isOpen, isMine, initialReview]);

  const handleSubmit = () => {
    if (!isValid) return;

    onSubmit({ rating, content: content.trim() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className="modal__header">
        <h2 className="modal__title">{isMine ? '수강평 수정하기' : '수강평 등록하기'}</h2>

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

          <div
            className={[
              styles['review-modal__field'],
              focused ? styles['review-modal__field--focus'] : '',
            ].join(' ')}
          >
            <div className={styles['review-modal__textarea-wrap']}>
              <textarea
                className={styles['review-modal__textarea']}
                placeholder={`수강평을 작성해보세요! (최소 ${minLength}자 이상)`}
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
            {showLengthHint && (
              <p className={styles['review-modal__hint']}>최소 {minLength}자 이상 입력해주세요.</p>
            )}
          </div>
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
            isValid
              ? styles['review-modal__button--submit--ready']
              : styles['review-modal__button--submit--idle'],
          ].join(' ')}
          disabled={!isValid}
          onClick={handleSubmit}
        >
          {isMine ? '수정' : '등록'}
        </button>
      </footer>
    </Modal>
  );
}
