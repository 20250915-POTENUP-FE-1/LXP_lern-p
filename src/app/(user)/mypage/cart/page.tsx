import Link from 'next/link';
import styles from '@/app/(user)/mypage/MyPageSections.module.css';

export default function PurchaseHistoryPage() {
  return (
    <section className={styles['cart']} aria-labelledby="mypage-purchase-title">
      <h1 id="mypage-purchase-title" className={styles['profile-section__title']}>
        구매 내역
      </h1>
      <p className={styles['cart__empty']}>구매 내역이 없습니다.</p>
      <Link className={styles['cart__cta']} href="/">
        강좌 보러 가기
      </Link>
    </section>
  );
}
