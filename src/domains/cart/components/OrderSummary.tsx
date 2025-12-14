import React from 'react';
import styles from './OrderSummary.module.css';

type Props = {
  totalPrice: number;
  discountPrice: number;
  finalPrice: number;
};

export const OrderSummary: React.FC<Props> = ({ totalPrice, discountPrice, finalPrice }) => {
  return (
    <section className={styles['order-summary']}>
      <h3 className={styles['order-summary__title']}>주문 요약</h3>
      <dl className={styles['order-summary__list']}>
        <div className={styles['order-summary__row']}>
          <dt>상품 금액</dt>
          <dd>{totalPrice.toLocaleString()}원</dd>
        </div>
        <div className={styles['order-summary__row']}>
          <dt>할인 금액</dt>
          <dd>-{discountPrice.toLocaleString()}원</dd>
        </div>
        <div
          className={`${styles['order-summary__row']} ${styles['order-summary__row--total']}`}
        >
          <dt>결제 금액</dt>
          <dd>{finalPrice.toLocaleString()}원</dd>
        </div>
      </dl>
    </section>
  );
};
