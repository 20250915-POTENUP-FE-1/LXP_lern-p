'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import styles from '@/app/(auth)/AuthPages.module.css';
import { useModal } from '@/shared/hooks/useModal';
import { validateSignUp } from '@/domains/auth/utils/validateSignUp';
import type { SignUpForm as SignUpFormValues } from '@/domains/auth/types/auth';
import { login } from '@/domains/auth/services/authService';
import { signUpAction, type SignUpActionState } from '../actions/signUpAction';
import { LoginModal } from './LoginModal';

const initialState: SignUpActionState = {
  error: '',
  success: false,
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={styles['form__submit']} disabled={pending || disabled}>
      {pending ? '가입 중...' : '회원가입'}
    </button>
  );
}

export function SignUpForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpFormValues>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [clientError, setClientError] = useState<string>('');
  const [state, formAction] = useActionState(signUpAction, initialState);

  const loginModal = useModal(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (clientError) setClientError('');
  };

  const validationMessage = validateSignUp(formData);
  const isInvalid = !!validationMessage;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (isInvalid) {
      e.preventDefault();
      setClientError(validationMessage ?? '입력값을 다시 확인해주세요.');
    } else {
      setClientError('');
      // 여기서 따로 preventDefault 안 하면 서버액션(formAction)이 호출됨
    }
  };

  const errorMessage = clientError || state.error;

  const isPwMismatch =
    formData.password.length > 0 &&
    formData.passwordConfirm.length > 0 &&
    formData.password !== formData.passwordConfirm;

  // 서버 액션 성공 후 자동 로그인 + 홈 이동
  useEffect(() => {
    if (!state.success) return;

    (async () => {
      try {
        await login({
          email: formData.email,
          password: formData.password,
        });
        router.push('/');
      } catch (err) {
        console.error(err);
        // 원하면 여기서 안내 문구도 추가 가능
        // setClientError('회원가입은 완료되었지만 자동 로그인에 실패했습니다. 로그인 페이지에서 다시 로그인해주세요.');
        router.push('/signin');
      }
    })();
  }, [state.success, formData.email, formData.password, router]);

  return (
    <>
      <form
        className={styles['form']}
        aria-label="회원가입 폼"
        action={formAction}
        onSubmit={handleSubmit}
      >
        <div className={styles['form__group']}>
          <label htmlFor="name" className={styles['form__label']}>
            닉네임
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={styles['form__control']}
            value={formData.name}
            onChange={handleChange}
            autoComplete="nickname"
            placeholder="예: lernP_lover"
          />
          <p className={styles['form__help']}>커뮤니티에 표시될 이름입니다.</p>
        </div>

        <div className={styles['form__group']}>
          <label htmlFor="email" className={styles['form__label']}>
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles['form__control']}
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div className={styles['form__group']}>
          <label htmlFor="password" className={styles['form__label']}>
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={styles['form__control']}
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="8자 이상 영문과 숫자를 조합하세요."
          />
          <p className={styles['form__help']}>안전한 비밀번호를 사용해주세요.</p>
        </div>

        <div className={styles['form__group']} data-error={isPwMismatch}>
          <label htmlFor="passwordConfirm" className={styles['form__label']}>
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            className={styles['form__control']}
            value={formData.passwordConfirm}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요."
          />
        </div>

        {errorMessage && (
          <p className={styles['form__error']} role="alert">
            {errorMessage}
          </p>
        )}

        <SubmitButton disabled={isInvalid} />
      </form>

      <div className={styles['auth-page__actions']}>
        이미 계정이 있으신가요?
        <button type="button" onClick={loginModal.open} className={styles['auth-page__link']}>
          로그인하기
        </button>
      </div>

      <LoginModal isOpen={loginModal.isOpen} onClose={loginModal.close} />
    </>
  );
}
