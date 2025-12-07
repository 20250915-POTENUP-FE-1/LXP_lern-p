'use client';

import { useEffect, useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { getAllCourses } from '../services/courseService';
import styles from '@/app/CourseListPage.module.css';
import { Course } from '../types/course';
import { CourseSort, SortOption } from '../components/CourseSort';

export default function CourseListClientPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sort, setSort] = useState<SortOption>('latest');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error('강좌 목록 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const sortedCourses = [...courses].sort((a, b) => {
    const getTime = (c: Course): number => {
      const v = c.createdAt as any;

      if (!v) return 0;

      // 문자열 또는 숫자 (예: "2025-01-01", 1710000000000)
      if (typeof v === 'string' || typeof v === 'number') {
        const t = new Date(v).getTime();
        return Number.isNaN(t) ? 0 : t;
      }

      // Date 인스턴스
      if (v instanceof Date) {
        return v.getTime();
      }

      // Firestore Timestamp 같은 객체 (toDate() 메서드 있는 경우)
      if (typeof v.toDate === 'function') {
        return v.toDate().getTime();
      }

      return 0;
    };

    const timeA = getTime(a);
    const timeB = getTime(b);

    switch (sort) {
      case 'latest':
        // 최신순: 더 최근(큰 값)이 앞으로
        return timeB - timeA;
      case 'oldest':
        // 오래된 순: 더 예전(작은 값)이 앞으로
        return timeA - timeB;
      case 'popular':
        // 수강인원순
        return (b.studentCount ?? 0) - (a.studentCount ?? 0);
      default:
        return 0;
    }
  });

  return (
    <main className={`${styles['course-list']} container`} aria-label="강좌 목록">
      {/* 본문 */}
      <div className={styles['bannerContainer']}>
        <div className={styles['bannerContent']}>
          {/* 메인 문구 */}
          <div className={styles['mainText']}>
            강사, 학생 둘 다 되는 게 <span className={styles['highlightText']}>런피</span>
          </div>

          {/* 보조 문구 */}
          <div className={styles['subText']}>한 번의 클릭으로 배움과 가르침을 모두 경험하세요</div>
        </div>
      </div>
      <div></div>
      <section className={styles['course-list__content']} aria-label="강좌 카드 목록">
        {loading ? (
          <p className={styles['course-list__loading']}>불러오는 중...</p>
        ) : courses.length === 0 ? (
          <p className={styles['course-list__empty']}>등록된 강좌가 없습니다.</p>
        ) : (
          <>
            <div className={styles['course-list__toolbar']}>
              <CourseSort value={sort} onChange={(nextSort) => setSort(nextSort)} />
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
