'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  loadTossPayments,
  ANONYMOUS,
  TossPaymentsWidgets,
  WidgetPaymentMethodWidget,
} from '@tosspayments/tosspayments-sdk';

type UseTossPaymentParams = {
  orderId: string;
  amount: number;
  courseId?: number;
};

const CLIENT_KEY = process.env.NEXT_PUBLIC_CLIENT_KEY ?? '';

export function useTossPayment({ orderId, amount, courseId }: UseTossPaymentParams) {
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [paymentMethodWidget, setPaymentMethodWidget] = useState<WidgetPaymentMethodWidget | null>(
    null,
  );

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(CLIENT_KEY); // SDK 초기화
        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS }); // 결제위젯 객체 생성
        setWidgets(widgets);
      } catch (error) {
        console.error('결제위젯을 불러올 수 없습니다:', error);
      }
    }

    fetchPaymentWidgets();
  }, [CLIENT_KEY, ANONYMOUS]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets) return;

      try {
        await widgets.setAmount({ value: Number(amount), currency: 'KRW' });
        const paymentMethodWidgetInstance = await widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        });
        setPaymentMethodWidget(paymentMethodWidgetInstance);
      } catch (error) {
        console.error('결제위젯을 렌더링할 수 없습니다:', error);
      }
    }

    renderPaymentWidgets();

    // 클린업: 결제 UI가 존재하면 제거합니다.
    return () => {
      if (paymentMethodWidget) {
        paymentMethodWidget.destroy();
        setPaymentMethodWidget(null);
      }
    };
  }, [widgets]);

  const handlePay = async (amount: number, orderName: string) => {
    if (!widgets || !orderId) return;

    try {
      await widgets.setAmount({ value: amount, currency: 'KRW' });
      // 결제 요청
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/orders/${orderId}/success?courseId=${courseId}`, // 결제 인증 성공시
        failUrl: `${window.location.origin}/orders/${orderId}/fail`, // 결제 인증 실패 시
      });
    } catch (error) {
      console.warn('결제 요청이 취소되었거나 실패했습니다.', error);
    }
  };

  return {
    handlePay,
  };
}
