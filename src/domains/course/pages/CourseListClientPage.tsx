'use client';

import { useEffect, useMemo, useState } from 'react';

import { CourseCard } from '../components/CourseCard';
import { getAllCourses } from '../services/courseService';
import styles from '@/app/CourseListPage.module.css';

import type { Course } from '../types/course';
import { useCourseListQuery } from '../hooks/useCourseListQuery';
import { SortSelect, sortCourses, SortableCourse } from '../components/SortSelect';

type CourseWithMeta = Course & SortableCourse;

export default function CourseListClientPage() {
  const [courses, setCourses] = useState<CourseWithMeta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { sort } = useCourseListQuery();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data as CourseWithMeta[]);
      } catch (error) {
        console.error('강좌 목록 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchCourses();
  }, []);

  const sortedCourses = useMemo(() => sortCourses<CourseWithMeta>(courses, sort), [courses, sort]);

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
