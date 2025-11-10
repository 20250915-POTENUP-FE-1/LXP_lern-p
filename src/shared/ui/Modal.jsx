import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({ isOpen, onClose, children }) => {
  const modalRoot = document.getElementById('modal-root');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }, [isOpen]);

  if (!isOpen) return null;

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
