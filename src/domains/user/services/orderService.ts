import { getApi } from '@/shared/lib/api/fetchApi';
import { GetOrdersParams, GetOrdersResponse } from '../types/order';

/**
 * 주문 목록 조회
 */
export const getOrders = async (params?: GetOrdersParams): Promise<GetOrdersResponse> => {
  const query = new URLSearchParams({
    page: String(params?.page ?? 0),
    size: String(params?.size ?? 10),
  });

  return await getApi<GetOrdersResponse>(`/api/orders?${query.toString()}`);
};
