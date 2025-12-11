'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/(user)/mypage/MyPageSections.module.css';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { getInstructorCourses } from '@/domains/user/services/instructorService';
import type { InstructorCourse } from '@/domains/user/types/instructor';

export default function InstructorCoursesPage() {
  const { user, loading: userLoading } = useAuthState();
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(false);

  /**
   * 강의 목록 불러오기
   */
  useEffect(() => {
    if (userLoading || !user?.id) return;

    (async () => {
      setCoursesLoading(true);
      try {
        const data = await getInstructorCourses(user.id);
        setCourses(data);
      } catch (err) {
        console.error('❌ 강좌 가져오기 실패:', err);
      } finally {
        setCoursesLoading(false);
      }
    })();
  }, [userLoading, user?.id]);

  /**
   * 로딩 UI
   */
  if (userLoading || coursesLoading) {
    return <div style={{ padding: '40px' }}>⏳ 강좌 불러오는 중...</div>;
  }

  /**
   * 강좌 없을 때 UI
   */
  if (courses.length === 0) {
    return <div style={{ padding: '40px' }}>🫠 개설한 강의가 아직 없어요.</div>;
  }

  return (
    <article
      className={styles['authored-section']}
      aria-labelledby="mypage-instructor-courses-title"
    >
      <h1 id="mypage-instructor-courses-title" className={styles['profile-section__title']}>
        내가 등록한 강좌
      </h1>

      <div className={styles['authored__actions']}>
        <Link
          href="/courses/create"
          className={`${styles['authored__btn']} ${styles['authored__btn--primary']}`}
        >
          내 강좌 만들기
        </Link>
      </div>

      <div className={styles['authored']}>
        {courses.map((course) => (
          <div key={course.id} className={styles['authored__item']}>
            <Link href={`/courses/${course.id}`}>
              <div className={styles['authored__meta']}>
                <h3 className={styles['authored__title']}>{course.title}</h3>
                <p className={styles['authored__category']}>
                  {Array.isArray(course.category)
                    ? course.category.join(' / ')
                    : (course.category ?? '카테고리 없음')}
                </p>
              </div>
            </Link>
            <div className={styles['authored__actions']}>
              {/*<Link href={`/courses/${course.id}/edit?step=1`} className={styles['authored__btn']}>
                수정
              </Link>*/}
              <button
                type="button"
                className={`${styles['authored__btn']} ${styles['authored__btn--delete']}`}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
