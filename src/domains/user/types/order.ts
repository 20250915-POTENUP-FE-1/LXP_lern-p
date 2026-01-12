export type OrderStatus = 'COMPLETED' | 'PARTIAL_CANCELED' | 'CANCELED' | 'REFUNDED'; // TODO: API 명세 확인 필요

export type Order = {
  orderId: string;
  paidAt: string;
  status: OrderStatus;
  totalAmount: number;
  // TODO: API 명세 확인 필요
  courses: {
    courseId: string;
    title: string;
    price: number;
  }[];
};

export type GetOrdersParams = {
  page?: number;
  size?: number;
};
export type GetOrdersResponse = {
  page: number;
  size: number;
  totalCount: number;
  orders: Order[];
};
