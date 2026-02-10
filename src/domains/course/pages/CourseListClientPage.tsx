'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '@/app/CourseListPage.module.css';
import { MOCK_GET_CATEGORIES } from '@/mocks/category.mock';
import { USE_MOCK } from '@/shared/constants/config';
import { CourseCard } from '../components/CourseCard';
import { getCategories } from '../services/courseCreateService';
import type { Category, CourseCardType } from '../types/course';
import { useCourseListQuery } from '../hooks/useCourseListQuery';
import { FilterNav } from '../components/FilterNav';
import type { CategoryMapEntry } from '../components/FilterNav';
import { SearchBar } from '../components/SearchBar';
import { SortSelect } from '../components/SortSelect';
import { LevelSelect } from '../components/LevelSelect';
import { useInfiniteCourseList } from '../hooks/useInfiniteCourseList';

/** API 응답 Category[] → FilterNav용 Record<string, string[]> 변환 */

export default function CourseListClientPage() {
  const [categoryMap, setCategoryMap] = useState<Record<string, CategoryMapEntry>>({});
  const { sort, size, categoryId, level, title, setCategoryLevelAndTitle } = useCourseListQuery();

  const {
    items: courses,
    isLoading,
    hasNext,
    setTarget,
  } = useInfiniteCourseList({
    size,
    sort,
    categoryId: categoryId ?? undefined,
    level: level ?? undefined,
    title,
  });

  const handleSelectCategory = (nextCategoryId: number | null) => {
    setCategoryLevelAndTitle(nextCategoryId, null, null);
  };

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

  const uniqueCourses = useMemo(() => {
    const map = new Map<string, CourseCardType>();
    courses.forEach((course) => {
      map.set(course.id, course);
    });
    return Array.from(map.values());
  }, [courses]);

  return (
    <main className={`${styles['course-list']} container`} aria-label="강좌 목록">
      <SearchBar />
      <FilterNav
        categoryMap={categoryMap}
        selectedCategoryId={categoryId}
        onSelectCategory={handleSelectCategory}
      />

      <section className={styles['course-list__content']} aria-label="강좌 카드 목록">
        <div className={styles['course-list__toolbar']}>
          <LevelSelect />
          <SortSelect />
        </div>
        {isLoading ? (
          <p className={styles['course-list__loading']}>불러오는 중...</p>
        ) : courses.length === 0 ? (
          <p className={styles['course-list__empty']}>
            {title.trim() ? '검색 결과가 없습니다.' : '등록된 강좌가 없습니다.'}
          </p>
        ) : (
          <>
            <div className={`${styles['course-list__cards']} ${styles['course-grid']}`}>
              {uniqueCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            {hasNext && <div ref={setTarget} />}
          </>
        )}
      </section>
    </main>
  );
}

function toCategoryMap(categories: Category[]): Record<string, CategoryMapEntry> {
  const map: Record<string, CategoryMapEntry> = {};
  for (const cat of categories) {
    if (cat.name === '전체') continue;
    map[cat.name] = {
      categoryId: cat.categoryId,
      children: cat.children.map((c) => ({ categoryId: c.categoryId, name: c.name })),
    };
  }
  return map;
}
