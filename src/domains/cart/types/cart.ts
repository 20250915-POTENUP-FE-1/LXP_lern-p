export type PreparePaymentRequest = {
  items: Array<{ courseId: number }>;
};

export type PreparePaymentResponse = {
  orderId: string;
  amount: number;
};

export type ConfirmPaymentRequest = {
  orderId: string;
  amount: number;
  paymentKey: string;
};

export type CartItem = {
  id: number; // 강좌 ID
  cartItemId?: number; // 장바구니 ID
  title: string;
  instructor: string;
  price: number;
  originalPrice: number;
  thumbnailUrl: string;
};

export type CartItemResponse = {
  cartItemId: number;
  courseId: number;
  courseTitle: string;
  instructorName: string;
  price: number;
  thumbnailUrl: string;
};

export type GetCartResponse = {
  cartId: number;
  items: CartItemResponse[];
  totalAmount: number;
};

export type AddCartItemRequest = {
  courseId: number;
};

export type AddCartItemResponse = {
  cartId: number;
  cartItemId: number;
  amount: number;
};

export type DeleteCartItemResponse = {
  cartId: number;
  removedCartItemId: number;
  amount: number;
};
