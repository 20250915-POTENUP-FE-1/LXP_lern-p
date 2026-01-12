import type { Review } from '@/domains/course/types/review';

export const MOCK_GET_COURSE_REVIEWS: Record<string, Review[]> = {
  '2002': [
    {
      id: 'rev_2002_001',
      courseId: '2002',
      rating: 5,
      content: '실무에서 바로 쓰는 구조로 설명해줘서 좋았어요.',
      createdAt: '2026-01-02T09:00:00Z',
      updatedAt: '2026-01-02T09:00:00Z',
      user: { nickname: '홍길동' },
      isMine: false,
      status: 'DISPLAY',
    },
  ],
  '2003': [
    {
      id: 'rev_2003_001',
      courseId: '2003',
      rating: 5,
      content: 'App Router 흐름을 이제야 제대로 이해했어요.',
      createdAt: '2026-01-03T09:00:00Z',
      updatedAt: '2026-01-03T09:00:00Z',
      user: { nickname: '최리액트' },
      isMine: false,
      status: 'DISPLAY',
    },
  ],
  '2004': [],
};
