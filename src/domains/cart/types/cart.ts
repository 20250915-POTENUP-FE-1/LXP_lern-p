export type PreparePaymentRequest = {
  items: Array<{ courseId: number }>;
};

export type PreparePaymentResponse = {
  orderId: string;
  amount: number;
};

export type ComfirmPaymentRequest = {
  orderId: string;
  amount: number;
  paymentKey: string;
};

export type CartItem = {
  id: number;
  title: string;
  instructor: string;
  price: number;
  originalPrice: number;
  thumbnailUrl: string;
};
