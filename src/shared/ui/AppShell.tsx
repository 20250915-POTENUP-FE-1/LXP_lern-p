import styles from '@/app/Layouts.module.css';
import { Header } from '@/shared/ui/Header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles['app-shell']}>
      <Header />
      <main id="main-content" className={styles['app-shell__main']}>
        {children}
      </main>
      <footer className={styles['app-shell__footer']} role="contentinfo">
        <p className={styles['app-shell__footer-text']}>© {new Date().getFullYear()} LernP</p>
      </footer>
    </div>
  );
}
