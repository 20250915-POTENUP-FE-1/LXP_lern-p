'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from '@/app/CourseListPage.module.css';
import { MOCK_GET_ALL_COURSE } from '@/mocks/course.mock';
import { CourseCard } from '../components/CourseCard';
import { getAllCourses } from '../services/courseService';
import type { CourseCardType, GetAllCourseResponse } from '../types/course';
import { useCourseListQuery } from '../hooks/useCourseListQuery';
import { SortSelect, sortCourses } from '../components/SortSelect';
import { LEVEL_LABEL } from '../constants/level';
import { USE_MOCK } from '@/shared/constants/config';

export default function CourseListClientPage() {
  const [courses, setCourses] = useState<CourseCardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { sort } = useCourseListQuery();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // TODO(mock): 개발 중 환경변수로 강좌 목록 데이터를 mock으로 조회
        const data: GetAllCourseResponse = USE_MOCK ? MOCK_GET_ALL_COURSE : await getAllCourses();
        const courseCardData: CourseCardType[] = data.content.map((item) => {
          const lastCategory = item.categories.at(-1) ?? '기타'; // 빈 배열 방어
          const thumbnailUrl = item.thumbnailUrl ?? ''; // optional 방어(원하면 기본 이미지 url)

          return {
            id: item.courseId,
            title: item.title,
            summary: item.summary,
            thumbnailUrl,
            instructorName: item.instructorName,
            category: item.categories,
            level: item.level,
            tags: [lastCategory, LEVEL_LABEL[item.level]], // 이제 string[] 확정
            price: item.price,
            isFree: item.price === 0,
            studentCount: item.studentCount,
          };
        });

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
            강사, 학생 둘 다 되는 게 <span className={styles['highlightText']}>런닉스</span>
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
