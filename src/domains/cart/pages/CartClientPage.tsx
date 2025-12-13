'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CartItem as CartItemType } from '@/domains/cart/types/cart';
import { OrderSummary } from '@/domains/cart/components/OrderSummary';
import { CartItem } from '@/domains/cart/components/CartItem';
import { preparePayment } from '@/domains/cart/services/cartService';
import { getCourseDetail } from '@/domains/course/services/courseService';
import styles from '@/app/cart/CartPage.module.css';
import type { PreparePaymentResponse } from '../types/cart';
import { useTossPayment } from '../hooks/useTossPayment';

export function CartClientPage() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get('courseId');
  const [items, setItems] = useState<CartItemType[]>([]);
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});
  const [isPreparing, setIsPreparing] = useState(false);
  const [paymentPayload, setPaymentPayload] = useState<PreparePaymentResponse | null>(null);

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
  const canSubmit = canCheckout && !isPreparing;

  const handleSelectChange = (id: number, checked: boolean) => {
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

  const handleCheckoutClick = async () => {
    if (!canCheckout) return;
    const firstTitle = selectedItems[0]?.title ?? '강좌';
    const orderName =
      selectedItems.length > 1 ? `${firstTitle} 외 ${selectedItems.length - 1}건` : firstTitle;
    await handlePay(orderName);
  };

  useEffect(() => {
    if (!initialCourseId) return;

    (async () => {
      try {
        const [detail, prepared] = await Promise.all([
          getCourseDetail(initialCourseId),
          preparePayment({ items: [{ courseId: Number(initialCourseId) }] }),
        ]);
        if (!detail) return;

        const mappedItem: CartItemType = {
          id: Number(detail.courseId),
          title: detail.title,
          instructor: detail.instructor?.name ?? '강사',
          price: detail.price,
          originalPrice: detail.price,
          thumbnailUrl: detail.thumbnailUrl,
        };

        setItems((prev) => {
          if (prev.some((item) => item.id === mappedItem.id)) return prev;
          return [...prev, mappedItem];
        });

        setSelectedMap((prev) => ({
          ...prev,
          [mappedItem.id]: true,
        }));

        setPaymentPayload(prepared);
      } catch (error) {
        console.error('결제 준비 요청에 실패했습니다.', error);
      }
    })();
  }, [initialCourseId]);

  const { handlePay } = useTossPayment({
    orderId: paymentPayload?.orderId ?? '',
    amount: paymentPayload?.amount ?? 0,
  });

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
              <div className={styles['cart-page__widget']}>
                <div id="payment-method" />
                <div id="agreement" />
              </div>
              {/* <h3 className={styles['cart-page__section-title']}>결제 수단</h3>
              <PaymentMethodList value={paymentMethod} onChange={setPaymentMethod} /> */}
            </section>
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
          id="payment-button"
          className={styles['cart-page__cta-button']}
          type="button"
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
          onClick={handleCheckoutClick}
        >
          결제하기
        </button>
      </div>
    </main>
  );
}
