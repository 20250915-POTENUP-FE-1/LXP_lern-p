import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { createUserProfile } from '../../user/services/UserService';
import { signUp } from '../services/authService';
import { validateSignUp } from '../utils/validateSignUp';
import styles from './AuthPages.module.css';

export default function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // 1) validation (분리됨)
    const errorMsg = validateSignUp(formData);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 2) Firebase Auth 회원가입
      const user = await signUp(formData.email, formData.password, formData.name);

      // 3) Firestore user document 생성 (user schema 반영)
      await createUserProfile({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        avatarUrl: user.photoURL,
      });

      navigate('/');
    } catch (err) {
      const message =
        {
          'auth/invalid-email': '올바른 이메일 형식이 아닙니다.',
          'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
          'auth/weak-password': '비밀번호가 너무 약합니다.',
        }[err.code] ?? '회원가입 중 오류가 발생했습니다.';

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
      <form onSubmit={handleSignUp} className={styles['form']} aria-label="회원가입 폼">
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
        <div className={styles['form__group']} data-error="false">
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
          <p className={styles['form__error']} role="alert">
            비밀번호가 일치하지 않습니다.
          </p>
        </div>
        <button type="submit" className={styles['form__submit']} disabled={loading}>
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
