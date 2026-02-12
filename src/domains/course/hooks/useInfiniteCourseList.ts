import { useCallback, useEffect } from 'react';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { USE_MOCK } from '@/shared/constants/config';
import { MOCK_GET_ALL_COURSE } from '@/mocks/course.mock';
import { getAllCourses } from '@/domains/course/services/courseService';
import { LEVEL_LABEL } from '@/domains/course/constants/level';
import { CourseCardType, GetAllCourseResponse, CourseLevel } from '../types/course';

type UseInfiniteCourseListParams = {
  size: number;
  sort?: string;
  categoryId?: number;
  keyword?: string;
  level?: CourseLevel;
};

export function useInfiniteCourseList(params: UseInfiniteCourseListParams) {
  const mockAdapter = useCallback(
    async (page: number): Promise<GetAllCourseResponse> => {
      const size = params.size;

      let filtered = [...MOCK_GET_ALL_COURSE.content];

      if (params.categoryId) {
        const categoryName = CATEGORY_ID_NAME_MAP[params.categoryId];
        if (categoryName) {
          filtered = filtered.filter((course) => course.categories.includes(categoryName));
        }
      }

      if (params.level) {
        filtered = filtered.filter((course) => course.level === params.level);
      }

      if (params.keyword?.trim()) {
        const keyword = params.keyword.toLowerCase();
        filtered = filtered.filter(
          (course) =>
            course.title.toLowerCase().includes(keyword) ||
            course.summary.toLowerCase().includes(keyword),
        );
      }

      const start = page * size;
      const end = start + size;

      return {
        ...MOCK_GET_ALL_COURSE,
        content: filtered.slice(start, end),
        currentPage: page,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
        hasNext: end < filtered.length,
      };
    },
    [params.size, params.categoryId, params.level, params.keyword],
  );

  type CourseItem = GetAllCourseResponse['content'][number];

  const toCourseCard = (item: CourseItem): CourseCardType => ({
    id: item.courseId,
    title: item.title,
    summary: item.summary,
    thumbnailUrl: item.thumbnailUrl ?? '/default-thumbnail.png',
    instructorName: item.instructorName,
    category: item.categories,
    level: item.level,
    tags: [item.categories[item.categories.length - 1], LEVEL_LABEL[item.level]],
    price: item.price,
    isFree: item.price === 0,
    studentCount: item.studentCount,
    reviewStat: item.reviewStat,
  });

  const loadPage = async (page: number) => {
    const data = USE_MOCK
      ? await mockAdapter(page)
      : await getAllCourses({
          page,
          size: params.size,
          sort: params.sort,
          categoryId: params.categoryId,
          level: params.level,
          keyword: params.keyword,
        });
    return {
      content: data.content.map(toCourseCard),
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      hasNext: data.hasNext,
      totalElements: data.totalElements,
    };
  };

  const infinite = useInfiniteScroll({ loadPage });

  useEffect(() => {
    infinite.reload();
  }, [params.categoryId, params.sort, params.level, params.keyword]);

  return infinite;
}

const CATEGORY_ID_NAME_MAP: Record<number, string> = {
  1: '프로그래밍',
  2: '백엔드',
  3: '프론트엔드',
  4: '데이터사이언스',
  5: '데이터 분석',
};
