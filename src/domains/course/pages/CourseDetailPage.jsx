// src/domains/course/pages/CourseDetailPage.jsx
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import CourseApply from '../components/CourseApply';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useEnrollment } from '../hooks/useEnrollment';
import styles from './CourseDetailPage.module.css';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  // 로그인 상태 관리
  const [currentUser, setCurrentUser] = useState(null);

  // UI 상태 관리
  const [activeTab, setActiveTab] = useState('intro');
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // 커스텀 훅으로 비즈니스 로직 분리
  const { course, sections, lectures, loading } = useCourseDetail(id);
  const { isEnrolled, enrolling, handleEnroll } = useEnrollment(currentUser, id);

  // 🔍 로그인 상태 구독
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsub();
  }, [auth]);

  // ========== 이벤트 핸들러 ==========

  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  const handleEnrollClick = () => {
    if (!course) return;

    if (course.isFree) {
      navigate('/#login-modal');
      return;
    }

    setShowEnrollModal(true);
  };

  const handleEnrollConfirm = async () => {
    try {
      await handleEnroll();
      setShowEnrollModal(false);
    } catch (error) {
      alert(error);
      navigate('/');
    }
  };

  // ========== 로딩/에러 처리 ==========
  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (!course) {
    return <div className={styles.error}>강좌를 찾을 수 없습니다</div>;
  }

  // ========== 계산된 값 ==========
  const totalLectures = sections.reduce((sum, sec) => sum + (lectures[sec.id]?.length || 0), 0);

  // ========== 렌더링 ==========
  return (
    <main className={`${styles['course-detail']} container`} aria-labelledby="course-detail-title">
      <div className={styles['course-detail__layout']}>
        {/* 1) 히어로 배경 */}
        <div className={styles['course-detail__hero']} aria-hidden="true" />

        {/* 2) 좌측 본문 */}
        <article className={styles['course-detail__main']}>
          <header className={styles['course-detail__header']}>
            <h1 id="course-detail-title" className={styles['course-detail__title']}>
              {course.title}
            </h1>
            <p className={styles['course-detail__instructor']}>{course.instructorName} 강사</p>

            <ul className={styles['course-detail__tags']} aria-label="강좌 태그">
              {course.tags?.map((tag, index) => (
                <li key={index} className={styles['course-detail__tag']}>
                  #{tag}
                </li>
              ))}
            </ul>

            <ul className={styles['course-detail__meta']} aria-label="강좌 정보">
              <li className={styles['course-detail__meta-item']}>
                👥 {course.studentCount}명 수강중
              </li>
              <li className={styles['course-detail__meta-item']}>{course.level}</li>
            </ul>

            <p className={styles['course-detail__summary']}>"{course.summary}"</p>
          </header>

          {/* ========== 탭 네비게이션 ========== */}
          <nav className={styles['course-tabs']} aria-label="강좌 상세 탭">
            <ul className={styles['course-tabs__list']}>
              <li>
                <a
                  href="#intro"
                  className={`${styles['course-tabs__link']} ${activeTab === 'intro' ? styles['active'] : ''}`}
                  aria-current={activeTab === 'intro' ? 'page' : undefined}
                  onClick={(e) => handleTabClick(e, 'intro')}
                >
                  강좌 소개
                </a>
              </li>
              <li>
                <a
                  href="#curriculum"
                  className={`${styles['course-tabs__link']} ${activeTab === 'curriculum' ? styles['active'] : ''}`}
                  aria-current={activeTab === 'curriculum' ? 'page' : undefined}
                  onClick={(e) => handleTabClick(e, 'curriculum')}
                >
                  커리큘럼
                </a>
              </li>
              <li>
                <a
                  href="#instructor"
                  className={`${styles['course-tabs__link']} ${activeTab === 'instructor' ? styles['active'] : ''}`}
                  aria-current={activeTab === 'instructor' ? 'page' : undefined}
                  onClick={(e) => handleTabClick(e, 'instructor')}
                >
                  강사 정보
                </a>
              </li>
            </ul>
          </nav>

          {/* ========== 탭 콘텐츠 ========== */}

          {activeTab === 'intro' && (
            <section
              id="intro"
              className={styles['course-detail__section']}
              aria-labelledby="intro-title"
            >
              <h2 id="intro-title" className={styles['course-detail__section-title']}>
                강좌 개요
              </h2>
              <p className={styles['course-detail__paragraph']}>
                {course.description || '강좌 개요는 추후 업데이트 예정'}
              </p>
            </section>
          )}

          {activeTab === 'curriculum' && (
            <section
              id="curriculum"
              className={styles['course-detail__section']}
              aria-labelledby="curriculum-title"
            >
              <h2 id="curriculum-title" className={styles['course-detail__section-title']}>
                커리큘럼
              </h2>

              {sections.length === 0 ? (
                <p>커리큘럼이 없습니다</p>
              ) : (
                <div>
                  {sections.map((sec) => (
                    <details key={sec.id} style={{ marginBottom: '10px' }}>
                      <summary
                        style={{ cursor: 'pointer', padding: '10px', background: '#f5f5f5' }}
                      >
                        {sec.title}
                        <span style={{ marginLeft: '10px', color: '#666' }}>
                          ({lectures[sec.id]?.length || 0}개 강의)
                        </span>
                      </summary>
                      <ul style={{ paddingLeft: '20px' }}>
                        {lectures[sec.id]?.map((lecture) => (
                          <li key={lecture.id} style={{ padding: '5px 0' }}>
                            {lecture.title} ({lecture.duration}분)
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'instructor' && (
            <section
              id="instructor"
              className={styles['course-detail__section']}
              aria-labelledby="instructor-title"
            >
              <h2 id="instructor-title" className={styles['course-detail__section-title']}>
                강사 정보
              </h2>
              <p className={styles['course-detail__paragraph']}>강사 소개는 추후 업데이트 예정</p>
            </section>
          )}
        </article>

        {/* 3) 우측 사이드바 */}
        <aside className={styles['course-detail__aside']} aria-label="신청 영역">
          <div
            className={`${styles['sidebar']} ${styles['sidebar--right']} ${styles['sidebar--floating']}`}
          >
            <h4>금액 ₩ {course.price.toLocaleString()}</h4>

            <button
              id="course-apply-module-Btn"
              className={`${styles['course-detail__cta-button']} ${
                isEnrolled ? styles['course-detail__cta-button--enrolled'] : ''
              }`}
              onClick={handleEnrollClick}
              disabled={isEnrolled}
            >
              {isEnrolled ? '수강 중입니다' : course.isFree ? '무료 수강하기' : '수강 신청'}
            </button>

            <ul className={styles['course-detail__cta-meta']}>
              <li className={styles['course-detail__cta-row']}>
                <span className={styles['course-detail__cta-label']}>강사</span>
                <span className={styles['course-detail__cta-value']}>{course.instructorName}</span>
              </li>
              <li className={styles['course-detail__cta-divider']} aria-hidden="true" />
              <li className={styles['course-detail__cta-row']}>
                <span className={styles['course-detail__cta-label']}>총 강의</span>
                <span className={styles['course-detail__cta-value']}>{totalLectures}강</span>
              </li>
              <li className={styles['course-detail__cta-divider']} aria-hidden="true" />
              <li className={styles['course-detail__cta-row']}>
                <span className={styles['course-detail__cta-label']}>총 시간</span>
                <span className={styles['course-detail__cta-value']}>{course.duration}분</span>
              </li>
              <li className={styles['course-detail__cta-divider']} aria-hidden="true" />
              <li className={styles['course-detail__cta-row']}>
                <span className={styles['course-detail__cta-label']}>난이도</span>
                <span className={styles['course-detail__cta-value']}>{course.level}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ========== 수강 신청 모달 ========== */}
      <CourseApply
        open={showEnrollModal}
        course={course}
        totalLectures={totalLectures}
        duration={course.duration}
        enrolling={enrolling}
        onCancel={() => setShowEnrollModal(false)}
        onConfirm={handleEnrollConfirm}
        isEnrolled={isEnrolled}
      />
    </main>
  );
}
