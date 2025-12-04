import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import type { FirebaseError } from 'firebase/app';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { validateForm } from '@/shared/util/validateForm';
import { validateSignUp } from '@/domains/auth/utils/validateSignUp';
import type { SignUpForm } from '@/domains/auth/types/auth';
import styles from './AuthPages.module.css';
import { createUserProfile } from '@/domains/user/services/userService';
import { signUp } from '@/domains/auth/services/authService';

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const isEmpty = validateForm(formData); // true 또는 false
  const isPwMismatch = formData.password !== formData.passwordConfirm;
  const isInvalid = isEmpty || isPwMismatch;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (error) setError('');
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1) validation
    const errorMsg = validateSignUp(formData);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 2) Firebase Auth 회원가입 (서비스 레이어 타입 사용)
      const authUser = await signUp({
        email: formData.email,
        password: formData.password,
        displayName: formData.name,
      });

      // 3) Firestore user document 생성
      await createUserProfile({
        id: authUser.uid,
        email: authUser.email,
        name: authUser.displayName ?? formData.name,
        avatarUrl: authUser.photoURL ?? null,
      });

      router.push('/');
    } catch (error: unknown) {
      const err = error as FirebaseError & { code?: string };

      const message =
        {
          'auth/invalid-email': '올바른 이메일 형식이 아닙니다.',
          'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
          'auth/weak-password': '비밀번호가 너무 약합니다.',
        }[err.code ?? ''] ?? '회원가입 중 오류가 발생했습니다.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles['auth-page']} aria-labelledby="title">
      <h1 id="title" className={styles['auth-page__title']}>
        회원가입
      </h1>

      <form
        onSubmit={handleSignUp}
        className={styles['form']}
        aria-label="회원가입 폼"
      >
        <div className={styles['form__group']}>
          <label htmlFor="name" className={styles['form__label']}>
            닉네임
          </label>
          <input
            id="name"
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
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={styles['form__control']}
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
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={styles['form__control']}
            autoComplete="new-password"
            placeholder="8자 이상 영문과 숫자를 조합하세요."
          />
          <p className={styles['form__help']}>안전한 비밀번호를 사용해주세요.</p>
        </div>

        <div
          className={styles['form__group']}
          data-error={isPwMismatch}
        >
          <label htmlFor="passwordConfirm" className={styles['form__label']}>
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className={styles['form__control']}
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요."
          />
        </div>

        {error && (
          <p className={styles['form__error']} role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={styles['form__submit']}
          disabled={loading || isInvalid}
        >
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>

      <div className={styles['auth-page__actions']}>
        이미 계정이 있으신가요?
        <Link className={styles['auth-page__link']} href="/signin">
          로그인하기
        </Link>
      </div>
    </section>
  );
}
