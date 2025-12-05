'use client';

import { useEffect, useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { getAllCourses } from '../services/courseService';
import styles from './CourseListPage.module.css';
import { Course } from '../types/course';

export default function CourseListClientPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
          <div className={`${styles['course-list__cards']} ${styles['course-grid']}`}>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
