import { CourseCard } from '@/domains/course/components/CourseCard';
import { getAllCourses } from '@/domains/course/services/courseService';
import { useEffect, useState } from 'react';
import styles from './CourseListPage.module.css';

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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
