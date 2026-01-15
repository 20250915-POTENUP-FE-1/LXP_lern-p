'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CartItem as CartItemType } from '@/domains/cart/types/cart';
import { OrderSummary } from '@/domains/cart/components/OrderSummary';
import { CartItem } from '@/domains/cart/components/CartItem';
import {
  addCartItem,
  deleteCartItem,
  getCart,
  preparePayment,
} from '@/domains/cart/services/cartService';
import styles from '@/app/cart/CartPage.module.css';
import { MOCK_GET_CART } from '@/mocks/cart.mock';
import { MOCK_GET_COURSE_DETAIL } from '@/mocks/course.mock';
import { USE_MOCK } from '@/shared/constants/config';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import type { CartItemResponse, PreparePaymentResponse } from '../types/cart';
import { useTossPayment } from '../hooks/useTossPayment';

const normalize = (arr: string[]) => arr.slice().sort().join('|');

export function CartClientPage() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get('courseId');

  const [items, setItems] = useState<CartItemType[]>([]);
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});
  const [paymentPayload, setPaymentPayload] = useState<PreparePaymentResponse | null>(null);

  const [cartLoading, setCartLoading] = useState(false);
  const [cartMutating, setCartMutating] = useState(false);

  const handledInitialCourseIdRef = useRef<string | null>(null);

  const { user, setUser } = useAuthState();
  const cartInitializedRef = useRef(false);

  const syncUserCartFromItems = (nextItems: CartItemType[]) => {
    const currentUser = user;
    if (!currentUser) return;

    const nextCourseIds = Array.from(new Set(nextItems.map((it) => String(it.id))));
    const prev = currentUser.cart ?? [];

    if (normalize(prev) === normalize(nextCourseIds)) return;

    setUser({
      ...currentUser,
      cart: nextCourseIds,
    });
  };

  useEffect(() => {
    if (!cartInitializedRef.current) return;
    syncUserCartFromItems(items);
  }, [items]);

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

  const canSubmit =
    canCheckout && !!paymentPayload?.orderId && paymentPayload.amount === finalPrice;

  const refetchCart = async (opts?: { selectOnlyCourseId?: string | null }) => {
    setCartLoading(true);
    try {
      const { items: details } = await getCart();
      const mappedItems = mapCartDetailsToItems(details);

      cartInitializedRef.current = true;

      setItems(mappedItems);

      if (opts?.selectOnlyCourseId) {
        setSelectedMap(buildSelectOnlyMap(mappedItems, opts.selectOnlyCourseId));
      } else {
        setSelectedMap(buildSelectAllMap(mappedItems));
      }
    } catch (e) {
      console.error('장바구니 목록 조회에 실패했습니다.', e);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    // TODO: API 정상화 후 제거 또는 MSW로 전환
    if (USE_MOCK) {
      const base = mapCartDetailsToItems(MOCK_GET_CART.items);

      cartInitializedRef.current = true;

      setItems((prev) => {
        const byId = new Map(prev.map((it) => [String(it.id), it]));
        base.forEach((it) => byId.set(String(it.id), it));
        const nextItems = Array.from(byId.values());

        setSelectedMap(() =>
          initialCourseId
            ? buildSelectOnlyMap(nextItems, initialCourseId)
            : buildSelectAllMap(nextItems),
        );

        return nextItems;
      });

      return;
    }

    void refetchCart({ selectOnlyCourseId: initialCourseId });
  }, []);

  useEffect(() => {
    if (!initialCourseId) return;
    if (handledInitialCourseIdRef.current === initialCourseId) return;
    handledInitialCourseIdRef.current = initialCourseId;

    (async () => {
      setCartMutating(true);
      try {
        // TODO: API 정상화 후 제거 또는 MSW로 전환
        if (USE_MOCK) {
          const detail = MOCK_GET_COURSE_DETAIL[Number(initialCourseId)];

          if (detail) {
            const mapped: CartItemType = {
              id: Number(detail.courseId),
              title: detail.title,
              instructor: detail.instructor?.name ?? '강사',
              price: detail.price,
              originalPrice: detail.price,
              thumbnailUrl: detail.thumbnailUrl,
            };

            setItems((prev) => {
              const nextItems = prev.some((x) => String(x.id) === String(mapped.id))
                ? prev
                : [...prev, mapped];

              setSelectedMap(buildSelectOnlyMap(nextItems, mapped.id));
              return nextItems;
            });
          } else {
            setSelectedMap((prev) => ({ ...prev, [String(initialCourseId)]: true }));
          }
          return;
        }

        await addCartItem({ courseId: Number(initialCourseId) });
        await refetchCart({ selectOnlyCourseId: initialCourseId });
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
        if (USE_MOCK) {
          setItems((prev) => prev.filter((item) => !deleteIds.has(String(item.id))));
          setSelectedMap((prev) => {
            const next = { ...prev };
            deleteIds.forEach((k) => delete next[k]);
            return next;
          });
          return;
        }

        await Promise.all(selectedItems.map((it) => deleteCartItem(Number(it.id))));
        await refetchCart();
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
        if (!USE_MOCK) {
          const prepared = await preparePayment({
            items: selectedItems.map((it) => ({ courseId: Number(it.id) })),
          });
          if (cancelled) return;
          setPaymentPayload(prepared);
        }
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

const mapCartDetailsToItems = (details: Array<CartItemResponse>) =>
  details.filter(Boolean).map((detail) => ({
    id: Number(detail.courseId),
    title: detail.courseTitle,
    instructor: detail.instructorName ?? '강사',
    price: detail.price,
    originalPrice: detail.price,
    thumbnailUrl: detail.thumbnailUrl,
  })) as CartItemType[];

const buildSelectAllMap = (list: CartItemType[]) =>
  Object.fromEntries(list.map((it) => [String(it.id), true])) as Record<string, boolean>;

const buildSelectOnlyMap = (list: CartItemType[], onlyId: string | number) => {
  const target = String(onlyId);
  return Object.fromEntries(list.map((it) => [String(it.id), String(it.id) === target])) as Record<
    string,
    boolean
  >;
};
