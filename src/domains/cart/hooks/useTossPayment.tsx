'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  loadTossPayments,
  ANONYMOUS,
  TossPaymentsWidgets,
  clearTossPayments,
} from '@tosspayments/tosspayments-sdk';

type UseTossPaymentParams = {
  orderId: string;
  amount: number;
  courseId?: number;
};

const CLIENT_KEY = process.env.NEXT_PUBLIC_CLIENT_KEY ?? '';

export function useTossPayment({ orderId, amount, courseId }: UseTossPaymentParams) {
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);

  const getContainer = useCallback((id: string) => document.getElementById(id), []);

  const autoSelectTossPayment = useCallback(() => {
    const container = getContainer('payment-method');
    if (!container) return;

    const selectors = [
      '[data-element-id="tosspay"]',
      'button[data-provider-code="TOSSPAY"]',
      'label[data-provider-code="TOSSPAY"]',
      '[data-method-code="TOSSPAY"]',
    ];

    let target: HTMLElement | null = null;
    for (const selector of selectors) {
      const element = container.querySelector(selector);
      if (element instanceof HTMLElement) {
        target = element;
        break;
      }
    }

    if (!target) {
      const possible = Array.from(container.querySelectorAll('button, label')).find((element) =>
        element.textContent?.includes('토스'),
      );
      target = possible instanceof HTMLElement ? possible : null;
    }

    if (target) {
      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  }, [getContainer]);

  useEffect(() => {
    (async () => {
      if (!orderId) {
        widgetsRef.current = null;
        return;
      }
      // 결제위젯 인스턴스 생성
      const tossPayments = await loadTossPayments(CLIENT_KEY);
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      widgetsRef.current = widgets;

      // 결제 금액 설정
      await widgets.setAmount({ value: Number(amount ?? 0), currency: 'KRW' });

      // 결제 UI 렌더링
      await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT',
      });
      autoSelectTossPayment();

      // 이용약관 UI 렌더링
      await widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });
    })();
    return () => {
      widgetsRef.current = null;
      clearTossPayments();
    };
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    const widgets = widgetsRef.current;
    if (!widgets) return;

    void widgets.setAmount({ value: Number(amount ?? 0), currency: 'KRW' });
  }, [amount, orderId]);

  const handlePay = async (orderName: string) => {
    const widgets = widgetsRef.current;
    if (!widgets || !orderId) return;

    try {
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
