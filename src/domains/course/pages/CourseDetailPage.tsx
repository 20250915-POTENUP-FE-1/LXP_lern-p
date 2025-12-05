'use client';

import { MouseEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { User, Section, Lecture } from '../types/course';
import { useModal } from '@/shared/hooks/useModal';
import { LoginModal } from '@/domains/auth/components/LoginModal';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { CourseApplyModal } from '@/domains/course/components/CourseApplyModal';
import { FloatingCTA } from '@/domains/course/components/FloatingCTA';
import { useCourseApply } from '@/domains/course/hooks/useCourseApply';
import { useCourseDetail } from '@/domains/course/hooks/useCourseDetail';
import { formatDuration } from '@/domains/course/utils/formatDuration';
import styles from './CourseDetailPage.module.css';

type TabKey = 'intro' | 'curriculum' | 'instructor';

export type CourseDetailPageProps = {
  courseId: string;
};

export default function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const { user } = useAuthState() as { user: User | null };

  const [activeTab, setActiveTab] = useState<TabKey>('intro');

  const loginModal = useModal(false);
  const applyModal = useModal(false);

  const { course, sections, lectures, loading } = useCourseDetail(courseId);
  const { isEnrolled, applying, handleApply } = useCourseApply(user, courseId);

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (!course) {
    return <div className={styles.error}>강좌를 찾을 수 없습니다</div>;
  }

  const handleTabClick = (e: MouseEvent<HTMLAnchorElement>, tabId: TabKey) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  const handleApplyClick = () => {
    if (!course) return;
    if (!user) {
      loginModal.open();
      return;
    }
    applyModal.open();
  };

  const openVideoPlayer = (videoUrl: string) => {
    if (!videoUrl) return;
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  const totalLectures = sections.reduce(
    (sum: number, sec: Section) => sum + (lectures[sec.id]?.length || 0),
    0,
  );

  const courseInfo = { ...course, totalLectures };
  const isOwner = !!user && user.id === course.instructorId;

  return (
    <main className={`${styles['course-detail']} container`} aria-labelledby="course-detail-title">
      <div className={styles['course-detail__layout']}>
        <Image
          className={styles['course-detail__hero']}
          src={course.thumbnailUrl}
          alt={`${course.title} 썸네일`}
          loading="lazy"
          width={800}
          height={450}
        />

        <article className={styles['course-detail__main']}>
          <header className={styles['course-detail__header']}>
            <h1 className={styles['course-detail__title']}>{course.title}</h1>
            <p className={styles['course-detail__instructor']}>{course.instructorName} 강사</p>

            {course.tags?.length > 0 && (
              <ul className={styles['course-detail__tags']}>
                {course.tags.map((tag: string, idx: number) => (
                  <li key={idx} className={styles['course-detail__tag']}>
                    #{tag}
                  </li>
                ))}
              </ul>
            )}

            <ul className={styles['course-detail__meta']}>
              <li className={styles['course-detail__meta-people']}>
                {course.studentCount ?? 0}명 수강중
              </li>
              <li>{course.level}</li>
            </ul>

            {course.summary && <p className={styles['course-detail__summary']}>{course.summary}</p>}
          </header>

          <nav className={styles['course-tabs']}>
            <ul className={styles['course-tabs__list']}>
              {[
                { key: 'intro' as TabKey, label: '강좌 소개' },
                { key: 'curriculum' as TabKey, label: '커리큘럼' },
                { key: 'instructor' as TabKey, label: '강사 정보' },
              ].map(({ key, label }) => (
                <li key={key}>
                  <Link
                    href={`#${key}`}
                    className={`${styles['course-tabs__link']} ${
                      activeTab === key ? styles['active'] : ''
                    }`}
                    onClick={(e) => handleTabClick(e, key)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {activeTab === 'intro' && (
            <section className={styles['course-detail__section']}>
              <h2 className={styles['course-detail__section-title']}>강좌 개요</h2>
              <p>{course.description || '강좌 개요는 추후 업데이트 예정입니다.'}</p>
            </section>
          )}

          {activeTab === 'curriculum' && (
            <section className={styles['course-detail__section']}>
              <h2 className={styles['course-detail__section-title']}>커리큘럼</h2>
              {sections.length === 0 ? (
                <p>커리큘럼이 없습니다</p>
              ) : (
                sections.map((sec: Section) => (
                  <details key={sec.id} open>
                    <summary>{sec.title}</summary>
                    <ul>
                      {lectures[sec.id]?.map((lec: Lecture) => (
                        <li key={lec.id}>
                          <div className={styles['course-detail__lecture']}>
                            <span className={styles['course-detail__lecture-title']}>
                              {lec.title} ({lec.duration}분)
                            </span>

                            {!isEnrolled && !isOwner && (
                              <div className={styles['course-detail__lecture-locked']}>
                                <span className={styles['course-detail__lecture-lock-icon']}>
                                  🔒
                                </span>
                                <span className={styles['course-detail__lecture-lock-text']}>
                                  수강 후 열람 가능
                                </span>
                              </div>
                            )}

                            {lec.videoUrl && (isEnrolled || isOwner) && (
                              <button
                                className={styles['course-detail__lecture-play']}
                                onClick={() => openVideoPlayer(lec.videoUrl)}
                              >
                                재생
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))
              )}
            </section>
          )}

          {activeTab === 'instructor' && (
            <section className={styles['course-detail__section']}>
              <h2 className={styles['course-detail__section-title']}>강사 정보</h2>
              <p>강사 소개는 추후 업데이트 예정입니다.</p>
            </section>
          )}
        </article>

        <FloatingCTA
          price={course.price}
          isFree={course.isFree}
          isEnrolled={isEnrolled}
          onApply={handleApplyClick}
          isOwner={isOwner}
          instructorName={course.instructorName}
          totalLectures={courseInfo.totalLectures}
          totalTime={formatDuration(course.duration)}
          level={course.level}
        />
      </div>

      <LoginModal isOpen={loginModal.isOpen} onClose={loginModal.close} />
      <CourseApplyModal
        isOpen={applyModal.isOpen}
        onClose={applyModal.close}
        course={courseInfo}
        user={user}
        isEnrolled={isEnrolled}
        applying={applying}
        onApply={handleApply}
      />
    </main>
  );
}
