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
      <div
        style={{
          transform: 'translateX(-25%)',
          width: '200%',
          minHeight: '300px',
          background: 'black',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '30px',
          marginBottom: '50px',
          padding: '60px 40px',
          gap: '30px',
        }}
      >
        {/* 메인 문구 */}
        <div
          style={{
            fontSize: '50px',
            fontWeight: '700',
            textAlign: 'center',
            lineHeight: '1.3',
          }}
        >
          강사, 학생 둘 다 되는 게 <span style={{ color: '#FF8C42' }}>런피</span>
        </div>

        {/* 보조 문구 */}
        <div
          style={{
            fontSize: '22px',
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 0.85)',
            textAlign: 'center',
            lineHeight: '1.5',
          }}
        >
          한 번의 클릭으로 배움과 가르침을 모두 경험하세요
        </div>
      </div>
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
