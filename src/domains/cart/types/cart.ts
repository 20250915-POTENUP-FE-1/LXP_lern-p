export type PreparePaymentRequest = {
  items: Array<{ courseId: string }>;
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
  id: string;
  title: string;
  instructor: string;
  price: number;
  originalPrice: number;
  thumbnailUrl: string;
};
