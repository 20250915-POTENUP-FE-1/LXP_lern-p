// src/shared/ui/Modal.tsx
'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Props 타입 정의
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    // body 스크롤 제어
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // cleanup: 컴포넌트 언마운트 시 원상복구
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  // modalRoot가 없으면 렌더링하지 않음 (SSR 대응)
  if (typeof window === 'undefined') return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.warn('⚠️ #modal-root 요소를 찾을 수 없습니다');
    return null;
  }

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
