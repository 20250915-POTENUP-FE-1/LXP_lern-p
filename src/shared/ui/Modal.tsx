'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  if (typeof window === 'undefined') return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.warn(' #modal-root 요소를 찾을 수 없습니다');
    return null;
  }

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
