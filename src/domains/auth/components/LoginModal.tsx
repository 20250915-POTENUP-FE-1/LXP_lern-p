// src/domains/auth/components/LoginModal.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Modal } from '@/shared/ui/Modal';
import { validateForm } from '@/shared/util/validateForm';
import { login } from '../services/authService';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isInvalid = validateForm(formData);
  const showError = (isInvalid && (formData.email || formData.password)) || !!error;

  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '' });
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isInvalid) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      onClose();
    } catch (err) {
      // ✅ 에러 타입 안전하게 처리
      const errorCode = (err as { code?: string })?.code;

      // ✅ 에러 메시지 매핑 객체
      const errorMessages: Record<string, string> = {
        'auth/invalid-email': '올바른 이메일 형식이 아닙니다.',
        'auth/user-not-found': '등록되지 않은 이메일입니다.',
        'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
        'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
        'auth/too-many-requests': '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.',
      };

      const message =
        errorCode && errorMessages[errorCode] ? errorMessages[errorCode] : '로그인에 실패했습니다.';

      setError(message);

      // ✅ 개발 환경에서 에러 로깅
      if (process.env.NODE_ENV === 'development') {
        console.error('로그인 에러:', err);
      }
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
          <div className={`modal__field ${showError ? 'modal__field--error' : ''}`}>
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
          <div className={`modal__field ${showError ? 'modal__field--error' : ''}`}>
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

          {error && <p className="modal__error-text">{error}</p>}
        </div>

        <footer className="modal__actions">
          <button type="submit" className="modal__button" disabled={loading || isInvalid}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
          <div className="modal__actions--bottom">
            아직 계정이 없으신가요?
            <Link href="/signup" className="modal__actions--link">
              회원가입
            </Link>
          </div>
        </footer>
      </form>
    </Modal>
  );
}
