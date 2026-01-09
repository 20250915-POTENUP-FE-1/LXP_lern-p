'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CartItem as CartItemType } from '@/domains/cart/types/cart';
import { OrderSummary } from '@/domains/cart/components/OrderSummary';
import { CartItem } from '@/domains/cart/components/CartItem';
import { preparePayment } from '@/domains/cart/services/cartService';
import { getCourseDetail } from '@/domains/course/services/courseService';
import styles from '@/app/cart/CartPage.module.css';
import { MOCK_GET_COURSE_DETAIL } from '@/mocks/course.mock';
import type { PreparePaymentResponse } from '../types/cart';
import { useTossPayment } from '../hooks/useTossPayment';

export function CartClientPage() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get('courseId');

  const [items, setItems] = useState<CartItemType[]>([]);
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});
  const [paymentPayload, setPaymentPayload] = useState<PreparePaymentResponse | null>(null);

  const [cartLoading, setCartLoading] = useState(false);
  const [cartMutating, setCartMutating] = useState(false);

  const handledInitialCourseIdRef = useRef<string | null>(null);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedMap[String(item.id)]),
    [items, selectedMap],
  );

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.originalPrice, 0);
  const finalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const discountPrice = totalPrice - finalPrice;
  const canCheckout = selectedItems.length > 0;
  const hasItems = items.length > 0;
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;

  // 결제 payload가 최신 선택 기준인지 간단 가드(선택)
  const canSubmit =
    canCheckout && !!paymentPayload?.orderId && paymentPayload.amount === finalPrice;

  const refetchCart = async () => {
    setCartLoading(true);
    try {
      // TODO: 장바구니 조회 API 연동

      const courseIds: string[] = []; // TODO: 장바구니 조회 API 연동 후 교체

      const details = await Promise.all(courseIds.map((id) => getCourseDetail(id)));

      const mappedItems = details.filter(Boolean).map((detail) => ({
        id: Number(detail.courseId),
        title: detail.title,
        instructor: detail.instructor?.name ?? '강사',
        price: detail.price,
        originalPrice: detail.price,
        thumbnailUrl: detail.thumbnailUrl,
      })) as CartItemType[];

      setItems(mappedItems);
      setSelectedMap(
        Object.fromEntries(mappedItems.map((item) => [String(item.id), true])) as Record<
          string,
          boolean
        >,
      );
    } catch (e) {
      console.error('장바구니 목록 조회에 실패했습니다.', e);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    // TODO: 장바구니 조회 API 연동 후 호출
    // void refetchCart();
  }, []);

  useEffect(() => {
    if (!initialCourseId) return;

    if (handledInitialCourseIdRef.current === initialCourseId) return;
    handledInitialCourseIdRef.current = initialCourseId;

    (async () => {
      setCartMutating(true);
      try {
        // TODO: 장바구니 담기 API 연동 (추가/수정/삭제가 같은 API일 수도 있음)

        // TODO: 장바구니 조회 API 연동 후 교체 및 refetchCart() 호출
        const detail = MOCK_GET_COURSE_DETAIL;

        if (detail) {
          const mapped: CartItemType = {
            id: Number(detail.courseId),
            title: detail.title,
            instructor: detail.instructor?.name ?? '강사',
            price: detail.price,
            originalPrice: detail.price,
            thumbnailUrl: detail.thumbnailUrl,
          };

          setItems((prev) =>
            prev.some((x) => String(x.id) === String(mapped.id)) ? prev : [...prev, mapped],
          );

          setSelectedMap((prev) => ({
            ...prev,
            [String(mapped.id)]: true,
          }));
        }
        // await refetchCart();

        setSelectedMap((prev) => ({
          ...prev,
          [String(initialCourseId)]: true,
        }));
      } catch (e) {
        console.error('장바구니 담기(추가) 처리에 실패했습니다.', e);
      } finally {
        setCartMutating(false);
      }
    })();
  }, [initialCourseId]);

  const handleSelectChange = (id: number, checked: boolean) => {
    setSelectedMap((prev) => ({
      ...prev,
      [String(id)]: checked,
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedMap(
      () =>
        Object.fromEntries(items.map((item) => [String(item.id), checked])) as Record<
          string,
          boolean
        >,
    );
  };

  const handleDeleteSelected = () => {
    if (!canCheckout) return;

    const deleteIds = new Set(selectedItems.map((it) => String(it.id)));

    (async () => {
      setCartMutating(true);
      try {
        // TODO: 장바구니 취소(제거) API 연동 (추가/수정/삭제가 같은 API일 수도 있음)

        setItems((prev) => {
          const remaining = prev.filter((item) => !deleteIds.has(String(item.id)));
          setSelectedMap(
            Object.fromEntries(remaining.map((item) => [String(item.id), true])) as Record<
              string,
              boolean
            >,
          );
          return remaining;
        });
      } catch (e) {
        console.error('장바구니 제거에 실패했습니다.', e);
      } finally {
        setCartMutating(false);
      }
    })();
  };

  // 선택된 아이템이 바뀔 때마다 결제 준비 요청
  const selectedKey = useMemo(
    () =>
      selectedItems
        .map((it) => String(it.id))
        .sort()
        .join(','),
    [selectedItems],
  );

  useEffect(() => {
    if (!canCheckout) {
      setPaymentPayload(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const prepared = await preparePayment({
          items: selectedItems.map((it) => ({ courseId: Number(it.id) })),
        });
        if (cancelled) return;
        setPaymentPayload(prepared);
      } catch (error) {
        console.error('결제 준비 요청에 실패했습니다.', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedKey, canCheckout]);

  const { handlePay } = useTossPayment({
    orderId: paymentPayload?.orderId ?? '',
    amount: paymentPayload?.amount ?? 0,
  });

  const handleCheckoutClick = async () => {
    if (!canSubmit) return;

    const firstTitle = selectedItems[0]?.title ?? '강좌';
    const orderName =
      selectedItems.length > 1 ? `${firstTitle} 외 ${selectedItems.length - 1}건` : firstTitle;

    await handlePay(paymentPayload!.amount, orderName);
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
                    disabled={cartLoading || cartMutating}
                  />
                  <span>전체 선택</span>
                </label>
                <button
                  type="button"
                  className={styles['cart-page__remove-selected']}
                  onClick={handleDeleteSelected}
                  disabled={!canCheckout || cartLoading || cartMutating}
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
                    checked={Boolean(selectedMap[String(item.id)])}
                    onSelectChange={(checked) => handleSelectChange(Number(item.id), checked)}
                  />
                ))}
              </ul>
            ) : (
              <div className={styles['cart-page__empty']}>
                <p className={styles['cart-page__empty-text']}>
                  {cartLoading ? '장바구니 불러오는 중...' : '담긴 강좌가 없습니다.'}
                </p>
                <Link href="/" className={styles['cart-page__empty-action']}>
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
          disabled={!canSubmit || cartLoading || cartMutating}
          aria-disabled={!canSubmit || cartLoading || cartMutating}
          onClick={handleCheckoutClick}
        >
          결제하기
        </button>
      </div>
    </main>
  );
}
