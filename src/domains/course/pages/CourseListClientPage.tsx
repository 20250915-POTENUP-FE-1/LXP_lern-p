'use client';

import { useEffect, useState } from 'react';
import styles from '@/app/CourseListPage.module.css';
import { MOCK_GET_ALL_COURSE } from '@/mocks/course.mock';
import { MOCK_GET_CATEGORIES } from '@/mocks/category.mock';
import { USE_MOCK } from '@/shared/constants/config';
import { CourseCard } from '../components/CourseCard';
import { getAllCourses } from '../services/courseService';
import { getCategories } from '../services/courseCreateService';
import type { CourseCardType, GetAllCourseResponse, Category } from '../types/course';
import { useCourseListQuery } from '../hooks/useCourseListQuery';
import { LEVEL_LABEL } from '../constants/level';
import { FilterNav } from '../components/FilterNav';
import type { CategoryMap } from '../components/FilterNav';
import { SearchBar } from '../components/SearchBar';
import { SortSelect } from '../components/SortSelect';

/** API 응답 Category[] → FilterNav용 Record<string, string[]> 변환 */
function toCategoryMap(categories: Category[]): CategoryMap {
  const map: CategoryMap = {};
  for (const cat of categories) {
    if (cat.name === '전체') continue;
    map[cat.name] = {
      categoryId: cat.categoryId,
      children: cat.children.map((c) => ({ categoryId: c.categoryId, name: c.name })),
    };
  }
  return map;
}

export default function CourseListClientPage() {
  const [courses, setCourses] = useState<CourseCardType[]>([]);
  const [categoryMap, setCategoryMap] = useState<CategoryMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const { sort, page, categoryId, level, title, setPage, setCategoryId } = useCourseListQuery();

  // 카테고리 데이터는 마운트 시 1회만
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = USE_MOCK ? MOCK_GET_CATEGORIES : await getCategories();
        setCategoryMap(toCategoryMap(categoryData));
      } catch (error) {
        console.error('카테고리 불러오기 실패:', error);
      }
    };
    void fetchCategories();
  }, []);

  // 필터/페이지 변경 시마다 강좌 목록 재조회
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data: GetAllCourseResponse = USE_MOCK
          ? MOCK_GET_ALL_COURSE
          : await getAllCourses({
              page,
              size: 10,
              categoryId: categoryId ?? undefined,
              level: level ?? undefined,
              title: title || undefined,
            });

        const courseCardData: CourseCardType[] = data.content.map((item) => ({
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
        }));

        setCourses(courseCardData);
        setTotalPages(data.totalPages);
        setHasNext(data.hasNext);
      } catch (error) {
        console.error('강좌 목록 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchCourses();
  }, [page, categoryId, level, title, sort]);

  return (
    <main className={`${styles['course-list']} container`} aria-label="강좌 목록">
      <SearchBar />
      <FilterNav
        categoryMap={categoryMap}
        selectedCategoryId={categoryId}
        onSelectCategory={setCategoryId}
      />

      <section className={styles['course-list__content']} aria-label="강좌 카드 목록">
        {loading ? (
          <p className={styles['course-list__loading']}>불러오는 중...</p>
        ) : courses.length === 0 ? (
          <p className={styles['course-list__empty']}>등록된 강좌가 없습니다.</p>
        ) : (
          <>
            <div className={styles['course-list__toolbar']}>
              <SortSelect />
            </div>
            <div className={`${styles['course-list__cards']} ${styles['course-grid']}`}>
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles['course-list__pagination']}>
                <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  이전
                </button>
                <span>
                  {page + 1} / {totalPages}
                </span>
                <button type="button" disabled={!hasNext} onClick={() => setPage(page + 1)}>
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
