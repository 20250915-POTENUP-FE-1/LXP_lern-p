import Link from 'next/link';
import styles from '@/app/Layouts.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles['auth-shell']}>
      <header className={styles['auth-shell__header']} role="banner" aria-label="인증 헤더">
        <Link href="/" className={styles['auth-shell__brand']}>
          LernP
        </Link>
      </header>

      <main className={styles['auth-shell__main']}>
        <div className={styles['auth']}>
          <div className={styles['auth__card']}>{children}</div>
        </div>
      </main>

      <footer className={styles['auth-shell__footer']} role="contentinfo">
        <p className={styles['auth-shell__footer-text']}>
          도움이 필요하신가요? support@lernp.example
        </p>
      </footer>
    </div>
  );
}
