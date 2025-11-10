import { Modal } from '../../../shared/ui/Modal';

export function RoleRequestModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className="modal__header">
        <h2 id="role-request-title" className="modal__title">
          강사 권한 요청
        </h2>
        <button type="button" className="modal__close" aria-label="닫기" onClick={onClose}>
          ×
        </button>
      </header>
      <div className="modal__body">
        <form className="modal__form" aria-label="강사 권한 요청 폼">
          <div className="modal__field">
            <label htmlFor="rr-name" className="modal__label">
              이름
            </label>
            <input id="rr-name" type="text" className="modal__input" />
          </div>
          <div className="modal__field">
            <label htmlFor="rr-portfolio" className="modal__label">
              포트폴리오 URL
            </label>
            <input
              id="rr-portfolio"
              type="url"
              className="modal__input"
              placeholder="https://..."
            />
          </div>
          <div className="modal__field">
            <label htmlFor="rr-message" className="modal__label">
              요청 사유
            </label>
            <textarea id="rr-message" rows="4" className="modal__textarea" />
          </div>
        </form>
      </div>
      <footer className="modal__actions">
        <button type="submit" className="modal__button">
          요청 보내기
        </button>
      </footer>
    </Modal>
  );
}
