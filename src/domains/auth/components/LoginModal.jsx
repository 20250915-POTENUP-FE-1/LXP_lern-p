import { Modal } from '@/shared/ui/Modal';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { login } from '../services/authService';

export function LoginModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '' });
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      onClose();
    } catch (err) {
      const message =
        {
          'auth/invalid-email': '올바른 이메일 형식이 아닙니다.',
          'auth/user-not-found': '등록되지 않은 이메일입니다.',
          'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
        }[err.code] ?? '로그인에 실패했습니다.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

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

      <form className="modal__form" aria-label="로그인 폼" onSubmit={handleLogin}>
        <div className="modal__body">
          <div className="modal__field">
            <label htmlFor="email" className="modal__label">
              이메일
            </label>
            <input
              id="email"
              type="email"
              className="modal__input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="modal__field">
            <label htmlFor="password" className="modal__label">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className="modal__input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <footer className="modal__actions">
          <button type="submit" className="modal__button" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
          <div className="modal__actions--bottom">
            아직 계정이 없으신가요?
            <Link className="modal__actions--link" to="/signup">
              회원가입
            </Link>
          </div>
        </footer>
      </form>
    </Modal>
  );
}
