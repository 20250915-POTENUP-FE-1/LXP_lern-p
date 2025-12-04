import { Outlet } from 'react-router';
import { Header } from '@/shared/ui/Header';
import styles from './Layouts.module.css';

export default function AppLayout() {
  return (
    <div className={styles['app-shell']}>
      <Header />
      <main id="main-content" className={styles['app-shell__main']}>
        <Outlet />
      </main>
      <footer className={styles['app-shell__footer']} role="contentinfo">
        <p className={styles['app-shell__footer-text']}>© {new Date().getFullYear()} lernP</p>
      </footer>
    </div>
  );
}
