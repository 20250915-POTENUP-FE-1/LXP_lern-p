import { redirect } from 'next/navigation';
import { confirmPayment } from '@/domains/cart/services/cartService';

interface OrderCompletePageProps {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

export default async function OrderCompletePage({ searchParams }: OrderCompletePageProps) {
  const { orderId, paymentKey, amount } = await searchParams;

  try {
    await confirmPayment({
      orderId,
      paymentKey,
      amount: Number(amount),
    });
  } catch (e) {
    console.error('주문 완료 실패', e);
  }
  // 결제 완료 API 호출 후, 현재는 수강 목록(추후 마이페이지 주문 목록) 이동
  return redirect('/mypage/enrollment');
}
