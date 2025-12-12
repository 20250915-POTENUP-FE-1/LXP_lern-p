import { postApi } from '@/shared/lib/api/fetchApi';
import {
  ComfirmPaymentRequest,
  PreparePaymentRequest,
  PreparePaymentResponse,
} from '../types/cart';

/**
 * 결제 준비
 */
export const preparePayment = async ({
  items,
}: PreparePaymentRequest): Promise<PreparePaymentResponse> => {
  return await postApi<PreparePaymentResponse>('/payments/prepare', { items });
};

/**
 * 결제 완료
 */
export const confirmPayment = async ({
  orderId,
  paymentKey,
  amount,
}: ComfirmPaymentRequest): Promise<null> => {
  return await postApi<null>('/payments/confirm', { orderId, paymentKey, amount });
};
