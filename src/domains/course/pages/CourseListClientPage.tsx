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
import { sortCourses, SortSelect } from '../components/SortSelect';
import { LevelSelect } from '../components/LevelSelect';

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

function toCategoryIdMap(categories: Category[]): Record<number, string> {
  const map: Record<number, string> = {};
  for (const cat of categories) {
    map[cat.categoryId] = cat.name;
    for (const child of cat.children) {
      map[child.categoryId] = child.name;
    }
  }
  return map;
}

export default function CourseListClientPage() {
  const [courses, setCourses] = useState<CourseCardType[]>([]);
  const [categoryMap, setCategoryMap] = useState<CategoryMap>({});
  const [categoryIdToName, setCategoryIdToName] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const { sort, page, size, categoryId, level, title, setPage, setCategoryId } =
    useCourseListQuery();

  // 카테고리 데이터는 마운트 시 1회만
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = USE_MOCK ? MOCK_GET_CATEGORIES : await getCategories();
        setCategoryMap(toCategoryMap(categoryData));
        setCategoryIdToName(toCategoryIdMap(categoryData));
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
          ? (() => {
              const titleKeyword = title.trim().toLowerCase();
              const categoryName = categoryId != null ? categoryIdToName[categoryId] : undefined;
              let filtered = MOCK_GET_ALL_COURSE.content;

              if (categoryName) {
                filtered = filtered.filter((item) => item.categories.includes(categoryName));
              }

              if (level) {
                filtered = filtered.filter((item) => item.level === level);
              }

              if (titleKeyword) {
                filtered = filtered.filter((item) =>
                  item.title.toLowerCase().includes(titleKeyword),
                );
              }

              const sorted = sortCourses(
                filtered.map((item) => ({
                  ...item,
                  createdAt: item.lastModifiedAt,
                })),
                sort,
              );

              const totalElements = sorted.length;
              const totalPagesValue = totalElements === 0 ? 0 : Math.ceil(totalElements / size);
              const start = page * size;
              const end = start + size;
              return {
                ...MOCK_GET_ALL_COURSE,
                content: sorted.slice(start, end),
                currentPage: page,
                size,
                totalElements,
                totalPages: totalPagesValue,
                hasNext: totalPagesValue > 0 && page + 1 < totalPagesValue,
              };
            })()
          : await getAllCourses({
              page,
              size,
              sort,
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
  }, [page, size, categoryId, level, title, sort, categoryIdToName]);

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
          <p className={styles['course-list__empty']}>
            {title.trim() ? '검색 결과가 없습니다.' : '등록된 강좌가 없습니다.'}
          </p>
        ) : (
          <>
            <div className={styles['course-list__toolbar']}>
              <LevelSelect />
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
