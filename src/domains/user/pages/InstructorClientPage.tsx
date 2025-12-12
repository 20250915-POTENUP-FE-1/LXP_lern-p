'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from '@/app/(user)/mypage/MyPageSections.module.css';
import { getInstructorCourses } from '@/domains/course/services/instructorCourseService';
import type { InstructorCourseListItemResponse } from '@/domains/course/types/instructor';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';

export default function InstructorCourseClientPage() {
  const { user, loading: userLoading } = useAuthState();
  const [courses, setCourses] = useState<InstructorCourseListItemResponse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCourses() {
      setCoursesLoading(true);
      try {
        const page = await getInstructorCourses();
        setCourses(page.content);
      } catch (e) {
        console.error('강사 강좌 목록 조회 실패', e);
      } finally {
        setCoursesLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (userLoading || coursesLoading) {
    return <div style={{ padding: '40px' }}>⏳ 강좌 불러오는 중...</div>;
  }

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
          <Link href={`/courses/${course.courseId}`} key={course.courseId}>
            <div className={styles['authored__item']}>
              <div className={styles['authored__meta']}>
                <h3 className={styles['authored__title']}>{course.title}</h3>
                <p className={styles['authored__category']}>{course.categories.join(' / ')}</p>
              </div>

              {/* <div className={styles["authored__actions"]}>
                <button className={styles["authored__btn"]}>수정</button>
                <button
                  type="button"
                  className={`${styles["authored__btn"]} ${styles["authored__btn--delete"]}`}
                >
                  삭제
                </button>
               </div>  */}
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
