import { SignUpForm } from '@/domains/auth/components/SignUpForm';
import styles from '../AuthPages.module.css';

export default function SignUpPage() {
  return (
    <>
      <h1 id="title" className={styles['auth-page__title']}>
        회원가입
      </h1>
      <SignUpForm />
    </>
  );
}
