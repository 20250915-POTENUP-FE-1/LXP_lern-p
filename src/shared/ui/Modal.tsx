'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById('modal-root');
    setModalRoot(el);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <div id="modal" className="modal is-open" role="dialog" aria-modal="true">
      {/* 배경 오버레이 */}
      <div className="modal__overlay" onClick={onClose} aria-label="닫기" />
      {/* 콘텐츠 */}
      <div className="modal__content" onClick={(e) => e.stopPropagation()} role="document">
        {children}
      </div>
    </div>,
    modalRoot,
  );
};
