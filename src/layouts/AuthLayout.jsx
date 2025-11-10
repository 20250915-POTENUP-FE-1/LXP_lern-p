import { Link, Outlet } from 'react-router';
import styles from './Layouts.module.css';

export default function AuthLayout() {
  return (
    <div className={styles['auth-shell']}>
      <header className={styles['auth-shell__header']} role="banner" aria-label="인증 헤더">
        <Link to="/" className={styles['auth-shell__brand']}>
          lernP
        </Link>
      </header>

      <main className={styles['auth-shell__main']} role="main">
        <div className={styles['auth']}>
          <div className={styles['auth__card']}>
            <Outlet />
          </div>
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
