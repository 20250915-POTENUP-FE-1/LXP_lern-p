import { Modal } from '@/shared/ui/Modal';
import { Link } from 'react-router';

export function LoginModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className="modal__header">
        <h2 id="login-modal-title" className="modal__title">
          로그인
        </h2>
        <button type="button" className="modal__close" aria-label="닫기" onClick={onClose}>
          ×
        </button>
      </header>

      <div className="modal__body">
        <form className="modal__form" aria-label="로그인 폼">
          <div className="modal__field">
            <label htmlFor="li-email" className="modal__label">
              이메일
            </label>
            <input id="li-email" type="email" className="modal__input" />
          </div>
          <div className="modal__field">
            <label htmlFor="li-password" className="modal__label">
              비밀번호
            </label>
            <input id="li-password" type="password" className="modal__input" />
          </div>
        </form>
      </div>

      <footer className="modal__actions">
        <button type="submit" className="modal__button">
          로그인
        </button>
        <div className="modal__actions--bottom">
          아직 계정이 없으신가요?
          <Link className="modal__actions--link" to="/signup">
            회원가입
          </Link>
        </div>
      </footer>
    </Modal>
  );
}
