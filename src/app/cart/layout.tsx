import { Header } from '@/shared/ui/Header';
import styles from './CartLayout.module.css';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles['cart-layout']}>
      <Header />
      <main id="main-content" className={styles['cart-layout__main']}>
        <div className={styles['cart-layout__content']}>{children}</div>
      </main>
    </div>
  );
}
