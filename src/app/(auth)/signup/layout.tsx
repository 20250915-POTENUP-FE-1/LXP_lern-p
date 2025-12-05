import styles from '../AuthPages.module.css';

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles['auth-page__layout']}>
      <section className={styles['auth-page']} aria-label="인증 페이지">
        {children}
      </section>
    </main>
  );
}
