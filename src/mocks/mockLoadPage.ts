import { MOCK_ITEMS } from '@/mocks/mockItem';
import { PageResponse } from '@/shared/hooks/useInfiniteScroll';

const PAGE_SIZE = 10;

export async function mockLoadPage(
  page: number,
): Promise<PageResponse<{ id: number; title: string }>> {
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const content = MOCK_ITEMS.slice(start, end);

  return {
    content,
    currentPage: page,
    totalPages: Math.ceil(MOCK_ITEMS.length / PAGE_SIZE),
    hasNext: end < MOCK_ITEMS.length,
  };
}
