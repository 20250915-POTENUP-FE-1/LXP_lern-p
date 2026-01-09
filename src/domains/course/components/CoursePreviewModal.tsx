'use client';

import { Modal } from '@/shared/ui/Modal';
import { Lecture } from '../types/course';
import { useEffect, useRef, useState } from 'react';
import styles from './CoursePreviewModal.module.css';

export type CoursePreviewModalProps = {
  isOpen: boolean;
  lectures: Lecture[];
  initialSelectedLectureId?: string;
  onClose: () => void;
};

export default function CoursePreviewModal({
  isOpen,
  lectures,
  onClose,
  initialSelectedLectureId,
}: CoursePreviewModalProps) {
  const [selectedLectureId, setSelectedLectureID] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const selectedLecture = lectures.find((l) => l.id === selectedLectureId) ?? null;
  const src = selectedLecture?.resource?.fileUrl ?? '';

  useEffect(() => {
    if (!isOpen) return;
    if (lectures.length === 0) return;

    const isValidInitial =
      initialSelectedLectureId && lectures.some((l) => l.id === initialSelectedLectureId);

    const firstId = isValidInitial ? initialSelectedLectureId : lectures[0].id;
    setSelectedLectureID(firstId);
  }, [isOpen, lectures, initialSelectedLectureId]);

  useEffect(() => {
    const v = videoRef.current;
    if (!isOpen) return;
    if (!v) return;
    if (!src) return;

    v.pause();
    try {
      v.currentTime = 0;
    } catch {}

    v.load();

    void v.play().catch(() => {});
  }, [isOpen, src]);

  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className="modal__header">
        <h2 id="course-preview-modal-title" className="modal__title">
          {selectedLecture ? selectedLecture.title : '강의 미리보기'}
        </h2>

        <button type="button" className="modal__close" aria-label="닫기" onClick={onClose}>
          ×
        </button>
      </header>

      <div className="modal__body" aria-labelledby="course-preview-modal-title">
        {/* 플레이어 */}
        <section aria-label="미리보기 영상" className={styles['course-preview__video-sticky']}>
          {selectedLecture && src ? (
            <div className={styles['course-preview__video-wrap']}>
              <video
                ref={videoRef}
                src={src}
                controls
                preload="metadata"
                playsInline
                className={styles['course-preview__video']}
              />
            </div>
          ) : (
            <div className={styles['course-preview__video-empty']}>미리보기 영상이 없습니다</div>
          )}
        </section>

        {/* 리스트 */}
        <section aria-label="미리보기 강의 목록" className={styles['course-preview__list-section']}>
          <div className={`modal__label ${styles['course-preview__list-label']}`}>
            미리보기 가능한 강의
          </div>

          {lectures.length === 0 ? (
            <p className="modal__error-text" style={{ margin: 0 }}>
              표시할 강의가 없습니다
            </p>
          ) : (
            <ul role="list" className={styles['course-preview__list']}>
              {lectures.map((lec) => {
                const isActive = lec.id === selectedLectureId;

                return (
                  <li key={lec.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedLectureID(lec.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={[
                        'modal__button',
                        'modal__button--ghost',
                        styles['course-preview__item-button'],
                        isActive
                          ? styles['course-preview__item-button--active']
                          : styles['course-preview__item-button--inactive'],
                      ].join(' ')}
                    >
                      <span className={styles['course-preview__item-title']}>{lec.title}</span>
                      <span className={styles['course-preview__item-state']}>
                        {isActive ? '재생 중' : '선택'}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <footer className="modal__actions">
        <button type="button" className="modal__button" onClick={onClose}>
          닫기
        </button>
      </footer>
    </Modal>
  );
}
