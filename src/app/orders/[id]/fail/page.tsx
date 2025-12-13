import { redirect } from 'next/navigation';

interface OrderFailPageProps {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

export default async function OrderFailPage({ searchParams }: OrderFailPageProps) {
  const { courseId, orderId } = await searchParams;

  // 다시 결제 페이지로 이동
  return redirect(`/cart?courseId=${courseId}&orderId=${orderId}`);
}
