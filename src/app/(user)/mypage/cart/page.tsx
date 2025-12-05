import Link from 'next/link';
import styles from '@/app/(user)/mypage/MyPageSections.module.css';

export default function CartPage() {
  return (
    <section className={styles['cart']} aria-labelledby="mypage-cart-title">
      <h1 id="mypage-cart-title" className={styles['profile-section__title']}>
        장바구니
      </h1>
      <p className={styles['cart__empty']}>담긴 강좌가 없습니다.</p>
      <Link className={styles['cart__cta']} href="/">
        강좌 보러 가기
      </Link>
    </section>
  );
}
