'use client';

import { useEffect, useState, useActionState, type ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { validateForm } from '@/shared/util/validateForm';
import type { LoginForm } from '@/domains/auth/types/auth';
import { Modal } from '@/shared/ui/Modal';
import { loginAction, type LoginActionState } from '@/domains/auth/actions/loginAction';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const initialState: LoginActionState = {
  success: false,
  error: undefined,
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [clientError, setClientError] = useState<string>('');
  const [state, formAction] = useActionState<LoginActionState, FormData>(loginAction, initialState);

  const { pending } = useFormStatus();

  const isInvalid = validateForm(formData);
  const showError =
    (isInvalid && (formData.email || formData.password)) || !!clientError || !!state.error;

  // 서버 액션 성공 시 모달 닫기
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      (async () => {
        onClose();
        router.refresh();
      })();
    }
  }, [state.success, onClose]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (clientError) setClientError('');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (isInvalid) {
      e.preventDefault();
      setClientError('입력값을 다시 확인해주세요.');
    } else {
      setClientError('');
      // 여기서 따로 preventDefault 안 하면 서버액션(formAction)이 호출됨
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

      <form
        className="modal__form"
        aria-label="로그인 폼"
        action={formAction}
        onSubmit={handleSubmit}
      >
        <div className="modal__body">
          <div className={`modal__field ${showError ? 'modal__field--error' : ''}`}>
            <label htmlFor="email" className="modal__label">
              이메일
            </label>
            <input
              id="email"
              name="email"
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
              name="password"
              type="password"
              className="modal__input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* 클라 에러 또는 서버 에러 표시 */}
          {(clientError || state.error) && (
            <p className="modal__error-text">{clientError || state.error}</p>
          )}
        </div>

        <footer className="modal__actions">
          <button type="submit" className="modal__button" disabled={pending || isInvalid}>
            {pending ? '로그인 중...' : '로그인'}
          </button>
          <div className="modal__actions--bottom">
            아직 계정이 없으신가요?
            <Link className="modal__actions--link" href="/signup">
              회원가입
            </Link>
          </div>
        </footer>
      </form>
    </Modal>
  );
}
