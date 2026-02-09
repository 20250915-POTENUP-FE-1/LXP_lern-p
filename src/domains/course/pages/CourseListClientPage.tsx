'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '@/app/CourseListPage.module.css';
import { MOCK_GET_ALL_COURSE } from '@/mocks/course.mock';
import { MOCK_GET_CATEGORIES } from '@/mocks/category.mock';
import { USE_MOCK } from '@/shared/constants/config';
import { CourseCard } from '../components/CourseCard';
import { getAllCourses } from '../services/courseService';
import { getCategories } from '../services/courseCreateService';
import type { CourseCardType, GetAllCourseResponse, Category } from '../types/course';
import { useCourseListQuery } from '../hooks/useCourseListQuery';
import { sortCourses } from '../components/SortSelect';
import { LEVEL_LABEL } from '../constants/level';
import { FilterNav } from '../components/FilterNav';
import type { CategoryMap } from '../components/FilterNav';
import { SearchBar } from '../components/SearchBar';

/** API 응답 Category[] → FilterNav용 Record<string, string[]> 변환 */
function toCategoryMap(categories: Category[]): CategoryMap {
  const map: Record<string, string[]> = { 전체: [] };
  for (const cat of categories) {
    if (cat.name === '전체') continue;
    map[cat.name] = cat.children.map((c) => c.name);
  }
  return map;
}

export default function CourseListClientPage() {
  const [courses, setCourses] = useState<CourseCardType[]>([]);
  const [categoryMap, setCategoryMap] = useState<CategoryMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFirst, setSelectedFirst] = useState<string | null>(null);
  const [selectedSecond, setSelectedSecond] = useState<string | null>(null);

  const { sort } = useCourseListQuery();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [categoryData, data] = await Promise.all([
          // TODO(mock): 개발 중 환경변수로 강좌 목록 데이터를 mock으로 조회
          USE_MOCK ? Promise.resolve(MOCK_GET_CATEGORIES) : getCategories(),
          USE_MOCK ? Promise.resolve(MOCK_GET_ALL_COURSE) : getAllCourses(),
        ]);

        setCategoryMap(toCategoryMap(categoryData));

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
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  const filteredCourses = useMemo(() => {
    if (!selectedFirst || selectedFirst === '전체') return courses;

    if (selectedSecond) {
      return courses.filter((course) => course.category.includes(selectedSecond));
    }

    // 1차만 선택 → 해당 1차의 모든 2차 카테고리 이름으로 매칭
    const subCategories = categoryMap[selectedFirst] ?? [];
    return courses.filter((course) =>
      course.category.some((cat) => cat === selectedFirst || subCategories.includes(cat)),
    );
  }, [courses, selectedFirst, selectedSecond, categoryMap]);

  const sortedCourses = useMemo(
    () => sortCourses<CourseCardType>(filteredCourses, sort),
    [filteredCourses, sort],
  );

  return (
    <main className={`${styles['course-list']} container`} aria-label="강좌 목록">
      <SearchBar />
      <FilterNav
        categoryMap={categoryMap}
        selectedFirst={selectedFirst}
        selectedSecond={selectedSecond}
        onSelectFirst={(cat) => {
          setSelectedFirst(cat);
          setSelectedSecond(null);
        }}
        onSelectSecond={setSelectedSecond}
      />
      {/* <div className={styles['bannerContainer']}>
        <div className={styles['bannerContent']}>
          <div className={styles['mainText']}>
            강사, 학생 둘 다 되는 게 <span className={styles['highlightText']}>런닉스</span>
          </div>
          <div className={styles['subText']}>한 번의 클릭으로 배움과 가르침을 모두 경험하세요</div>
        </div>
      </div> */}

      <section className={styles['course-list__content']} aria-label="강좌 카드 목록">
        {loading ? (
          <p className={styles['course-list__loading']}>불러오는 중...</p>
        ) : courses.length === 0 ? (
          <p className={styles['course-list__empty']}>등록된 강좌가 없습니다.</p>
        ) : (
          <>
            <div className={styles['course-list__toolbar']}>{/*<SortSelect />*/}</div>
            <div className={`${styles['course-list__cards']} ${styles['course-grid']}`}>
              {sortedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
