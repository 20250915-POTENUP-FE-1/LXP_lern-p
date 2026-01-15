import { getApi, postApi } from '@/shared/lib/api/fetchApi';
import {
  AddCartItemRequest,
  AddCartItemResponse,
  ConfirmPaymentRequest,
  DeleteCartItemResponse,
  GetCartResponse,
  PreparePaymentRequest,
  PreparePaymentResponse,
} from '../types/cart';

/**
 * 결제 준비
 */
export const preparePayment = async ({
  items,
}: PreparePaymentRequest): Promise<PreparePaymentResponse> => {
  return await postApi<PreparePaymentResponse>('/api/payments/prepare', { items });
};

/**
 * 결제 완료
 */
export const confirmPayment = async ({
  orderId,
  paymentKey,
  amount,
}: ConfirmPaymentRequest): Promise<null> => {
  return await postApi<null>('/api/payments/confirm', { orderId, paymentKey, amount });
};

/**
 * 장바구니 항목 전체 조회
 */
export const getCart = async (): Promise<GetCartResponse> => {
  return await getApi<GetCartResponse>('/api/cart');
};

/**
 * 장바구니 항목 추가
 */
export const addCartItem = async ({
  courseId,
}: AddCartItemRequest): Promise<AddCartItemResponse> => {
  return await postApi<AddCartItemResponse>('/api/cart/items', { courseId });
};

/**
 * 장바구니 항목 제거
 */
export const deleteCartItem = async (cartItemId: number): Promise<DeleteCartItemResponse> => {
  return await postApi<DeleteCartItemResponse>(`/api/cart/items/${cartItemId}`);
};
