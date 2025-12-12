'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from '@/app/(user)/mypage/MyPageSections.module.css';
import { getInstructorCourses } from '@/domains/course/services/instructorCourseService';
import type { InstructorCourse } from '@/domains/course/types/instructor';

export default function InstructorCourseClientPage() {
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const page = await getInstructorCourses();
        setCourses(page.content);
      } catch (e) {
        console.error('강사 강좌 목록 조회 실패', e);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) return <p>강좌를 불러오는 중입니다...</p>;

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
          <Link href={`/courses/${course.courseId}`}>
            <div className={styles['authored__item']}>
              <div className={styles['authored__meta']}>
                <h3 className={styles['authored__title']}>{course.title}</h3>
                <p className={styles['authored__category']}>{course.categories.join(' / ')}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
