'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/domains/cart/types/cart';
import { OrderSummary } from '@/domains/cart/components/OrderSummary';
import { CartItem } from '@/domains/cart/components/CartItem';
import { TermsAgreementState } from '@/domains/cart/components/TermsAgreementList';
import { PaymentMethodList, PaymentMethod } from '@/domains/cart/components/PaymentMethodList';
import styles from './CartPage.module.css';

const mockItems: CartItemType[] = [
  {
    id: 'course-frontend-react',
    title: '프론트엔드 마스터: React 완전 정복',
    instructor: '김프론트',
    price: 98000,
    originalPrice: 149000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=640',
  },
  {
    id: 'course-backend-spring',
    title: '스프링 부트로 배우는 백엔드 실전',
    instructor: '이백엔드',
    price: 87000,
    originalPrice: 129000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=640',
  },
];

export default function CartPage() {
  const [items, setItems] = useState(mockItems);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('toss');
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(mockItems.map((item) => [item.id, true])) as Record<string, boolean>,
  );
  const [agreements, setAgreements] = useState<TermsAgreementState>({
    all: false,
    required: false,
    marketing: false,
  });

  const selectedItems = useMemo(
    () => items.filter((item) => selectedMap[item.id]),
    [items, selectedMap],
  );

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.originalPrice, 0);
  const finalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const discountPrice = totalPrice - finalPrice;
  const canCheckout = selectedItems.length > 0;
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;
  const hasItems = items.length > 0;

  const handleAgreementChange = (next: TermsAgreementState) => {
    setAgreements(next);
  };

  const handleSelectChange = (id: string, checked: boolean) => {
    setSelectedMap((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedMap(
      () => Object.fromEntries(items.map((item) => [item.id, checked])) as Record<string, boolean>,
    );
  };

  const handleDeleteSelected = () => {
    if (!canCheckout) return;
    setItems((prev) => {
      const remaining = prev.filter((item) => !selectedMap[item.id]);
      setSelectedMap(
        Object.fromEntries(remaining.map((item) => [item.id, true])) as Record<string, boolean>,
      );
      return remaining;
    });
  };

  return (
    <main className={`${styles['cart-page']} app-shell`}>
      <div className="container">
        <div className={styles['cart-page__body']}>
          <section className={styles['cart-page__items']}>
            {hasItems && (
              <div className={styles['cart-page__controls']}>
                <label className={styles['cart-page__select-all']}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(event) => handleSelectAll(event.target.checked)}
                  />
                  <span>전체 선택</span>
                </label>
                <button
                  type="button"
                  className={styles['cart-page__remove-selected']}
                  onClick={handleDeleteSelected}
                  disabled={!canCheckout}
                >
                  선택 삭제
                </button>
              </div>
            )}
            {hasItems ? (
              <ul className={styles['cart-page__item-list']}>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    checked={Boolean(selectedMap[item.id])}
                    onSelectChange={(checked) => handleSelectChange(item.id, checked)}
                  />
                ))}
              </ul>
            ) : (
              <div className={styles['cart-page__empty']}>
                <p className={styles['cart-page__empty-text']}>담긴 강좌가 없습니다.</p>
                <Link href="/courses" className={styles['cart-page__empty-action']}>
                  강좌 보러가기
                </Link>
              </div>
            )}
          </section>

          <aside className={styles['cart-page__summary']}>
            <OrderSummary
              totalPrice={totalPrice}
              discountPrice={discountPrice}
              finalPrice={finalPrice}
            />

            <section className={styles['cart-page__payment']}>
              <h3 className={styles['cart-page__section-title']}>결제 수단</h3>
              <PaymentMethodList value={paymentMethod} onChange={setPaymentMethod} />
            </section>

            {/* <section className={styles['cart-page__terms']}>
              <h3 className={styles['cart-page__section-title']}>약관 동의</h3>
              <TermsAgreement value={agreements} onChange={handleAgreementChange} />
            </section> */}
          </aside>
        </div>
      </div>

      <div className={styles['cart-page__cta-bar']}>
        <div>
          <p className={styles['cart-page__cta-label']}>최종 결제 금액</p>
          <strong className={styles['cart-page__cta-price']}>
            {finalPrice.toLocaleString()}원
          </strong>
        </div>
        <button
          className={styles['cart-page__cta-button']}
          type="button"
          disabled={!canCheckout}
          aria-disabled={!canCheckout}
        >
          결제하기
        </button>
      </div>
    </main>
  );
}
