import type { GetReviewResponse } from '@/domains/course/types/review';

export const MOCK_GET_COURSE_REVIEWS: Record<string, GetReviewResponse[]> = {
  '2002': [
    {
      id: '1',
      userId: 'user_001',
      nickname: 'front',
      courseId: '2002',
      rating: 5,
      content: '실무에서 바로 쓰는 구조로 설명해줘서 좋았어요.',
      status: 'DISPLAY',
      reported: 0,
      createdAt: '2026-01-02T09:00:00Z',
      updatedAt: '2026-01-02T09:00:00Z',
    },
  ],
  '2003': [
    {
      id: '2',
      userId: 'user_002',
      nickname: '고양이',
      courseId: '2003',
      rating: 5,
      content: 'App Router 흐름을 이제야 제대로 이해했어요.',
      status: 'DISPLAY',
      reported: 0,
      createdAt: '2026-01-03T09:00:00Z',
      updatedAt: '2026-01-03T09:00:00Z',
    },
  ],
  '2004': [],
};
