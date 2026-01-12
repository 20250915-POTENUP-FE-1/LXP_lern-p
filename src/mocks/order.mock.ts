import { GetOrdersResponse } from '@/domains/user/types/order';

export const MOCK_GET_ORDERS: GetOrdersResponse = {
  page: 1,
  size: 10,
  totalCount: 3,
  orders: [
    {
      orderId: 'ORD-20260111-0001',
      paidAt: '2026-01-11T10:20:00.000Z',
      status: 'COMPLETED',
      totalAmount: 39000,
      courses: [{ courseId: 'c_101', title: 'Next.js App Router 실전', price: 39000 }],
    },
    {
      orderId: 'ORD-20260110-0002',
      paidAt: '2026-01-10T14:05:00.000Z',
      status: 'COMPLETED',
      totalAmount: 78000, // 39000 + 29000 + 10000
      courses: [
        { courseId: 'c_101', title: 'Next.js App Router 실전', price: 39000 },
        { courseId: 'c_204', title: 'React Query로 서버 상태 관리', price: 29000 },
        { courseId: 'c_150', title: 'TypeScript 타입 설계 패턴', price: 10000 },
      ],
    },
    {
      orderId: 'ORD-20260105-0003',
      paidAt: '2026-01-05T08:10:00.000Z',
      status: 'CANCELED',
      totalAmount: 25000,
      courses: [{ courseId: 'c_085', title: 'AWS 기초부터 배포까지', price: 25000 }],
    },
  ],
};
