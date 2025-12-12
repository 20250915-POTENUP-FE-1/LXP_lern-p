'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '@/app/CourseListPage.module.css';
import { CourseCard } from '../components/CourseCard';
import { getAllCourses } from '../services/courseService';
import type { CourseCardType, GetAllCourseResponse } from '../types/course';
import { useCourseListQuery } from '../hooks/useCourseListQuery';
import { SortSelect, sortCourses } from '../components/SortSelect';
import { LEVEL_LABEL } from '../constants/level';

export default function CourseListClientPage() {
  const [courses, setCourses] = useState<CourseCardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { sort } = useCourseListQuery();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data: GetAllCourseResponse = await getAllCourses();

        const courseCardData: CourseCardType[] = data.content.map((item) => ({
          id: item.courseId,
          title: item.title,
          summary: item.summary,
          thumbnailUrl: item.thumbnailUrl,
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
        console.error('강좌 목록 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchCourses();
  }, []);

  const sortedCourses = useMemo(() => sortCourses<CourseCardType>(courses, sort), [courses, sort]);

  return (
    <main className={`${styles['course-list']} container`} aria-label="강좌 목록">
      <div className={styles['bannerContainer']}>
        <div className={styles['bannerContent']}>
          <div className={styles['mainText']}>
            강사, 학생 둘 다 되는 게 <span className={styles['highlightText']}>런피</span>
          </div>
          <div className={styles['subText']}>한 번의 클릭으로 배움과 가르침을 모두 경험하세요</div>
        </div>
      </div>

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
