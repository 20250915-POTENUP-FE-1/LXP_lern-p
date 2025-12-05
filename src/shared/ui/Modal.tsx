'use client';

import { type PropsWithChildren, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const Modal = ({ isOpen, onClose, children }: PropsWithChildren<ModalProps>) => {
  // 스크롤 락 처리
  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // SSR 환경 대비
  if (typeof document === 'undefined') return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div id="modal" className="modal is-open" role="dialog" aria-modal="true">
      <div className="modal__overlay" onClick={onClose} aria-label="닫기" />
      <div className="modal__content" onClick={(e) => e.stopPropagation()} role="document">
        {children}
      </div>
    </div>,
    modalRoot,
  );
};
