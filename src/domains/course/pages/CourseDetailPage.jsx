import { useModal } from '@/shared/hooks/useModal';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { LoginModal } from '../../auth/components/LoginModal';
import { useAuthState } from '../../auth/hooks/useAuthState';
import { CourseApplyModal } from '../components/CourseApplyModal';
import { FloatingCTA } from '../components/FloatingCTA';
import { useCourseApply } from '../hooks/useCourseApply';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { formatDuration } from '../utils/formatDuration';
import styles from './CourseDetailPage.module.css';


export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuthState();

  // 탭 상태
  const [activeTab, setActiveTab] = useState('intro');

  // 모달 제어
  const loginModal = useModal(false);
  const applyModal = useModal(false);

  // 데이터 훅
  const { course, sections, lectures, loading } = useCourseDetail(id);
  const { isEnrolled, applying, handleApply } = useCourseApply(user, id);

  const handleTabClick = (e, tabId) => {
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

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (!course) return <div className={styles.error}>강좌를 찾을 수 없습니다</div>;

  const totalLectures = sections.reduce((sum, sec) => sum + (lectures[sec.id]?.length || 0), 0);
  const courseInfo = { ...course, totalLectures };

  const isOwner = user?.id === course.instructorId;

  return (
    <main className={`${styles['course-detail']} container`} aria-labelledby="course-detail-title">
      <div className={styles['course-detail__layout']}>
        <img
          className={styles['course-detail__hero']}
          src={course.thumbnailUrl}
          alt={`${course.title} 썸네일`}
          loading="lazy"
        />
        <article className={styles['course-detail__main']}>
          <header className={styles['course-detail__header']}>
            <h1 className={styles['course-detail__title']}>{course.title}</h1>
            <p className={styles['course-detail__instructor']}>{course.instructorName} 강사</p>

            {course.tags?.length > 0 && (
              <ul className={styles['course-detail__tags']}>
                {course.tags.map((tag, idx) => (
                  <li key={idx} className={styles['course-detail__tag']}>
                    #{tag}
                  </li>
                ))}
              </ul>
            )}

            <ul className={styles['course-detail__meta']}>
              <li className={styles['course-detail__meta-people']}><Users /> {course.studentCount ?? 0}명 수강중</li>
              <li>{course.level}</li>
            </ul>

            {course.summary && (
              <p className={styles['course-detail__summary']}>"{course.summary}"</p>
            )}
          </header>

          {/* 탭 */}
          <nav className={styles['course-tabs']}>
            <ul className={styles['course-tabs__list']}>
              {[
                { key: 'intro', label: '강좌 소개' },
                { key: 'curriculum', label: '커리큘럼' },
                { key: 'instructor', label: '강사 정보' },
              ].map(({ key, label }) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className={`${styles['course-tabs__link']} ${
                      activeTab === key ? styles['active'] : ''
                    }`}
                    onClick={(e) => handleTabClick(e, key)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 탭 콘텐츠 */}
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
                sections.map((sec) => (
                  <details key={sec.id} open>
                    <summary>{sec.title}</summary>
                    <ul>
                      {lectures[sec.id]?.map((lec) => (
                        <li key={lec.id}>
                          <div className={styles['course-detail__lecture']}>
                            <span className={styles['course-detail__lecture-title']}>
                              {lec.title} ({lec.duration}분)
                            </span>

                            {/* 잠금 상태 */}
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

                            {/* 재생 버튼 */}
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

        {/* 데스크탑용 사이드 CTA */}
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
          // onAddToCart={() => console.log('장바구니 담기 클릭')}
        />
      </div>

      {/* 모바일용 하단 고정 CTA */}

      {/* 모달 */}
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
