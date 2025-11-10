import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../shared/lib/firebase/config';
import styles from './CourseDetailPage.module.css';

// 로그인 확인 변수 선언
const auth = getAuth();
const navigate = useNavigate();

// 로그인 상태 변수
const [currentUser, setCurrentUser] = useState(null);

// 오픈 모달 상태
const [showLoginModal, setShowLoginModal] = useState(false);
const [showEnrollModal, setShowEnrollModal] = useState(false);

//컴포넌트 마운트 시 로그인 상태 구독
useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
  return () => unsub();
});

const handleEnrollClick = () => {
  if (!currentUser) {
    setShowLoginModal(true);
  } else {
    setShowEnrollModal(true);
  }
};

export default function CourseDetailPage() {
  const { courseId } = useParams(); //URL 에서 id : c_101 추출

  const [course, setCourse] = useState(null); //강좌1개 : { title: "React 입문", ... }
  const [section, setSections] = useState([]); //섹션 여러개(배열) : [{ id: "sec_01", title: "..." }, ...]
  const [lectures, setLectures] = useState({}); // 섹션별 강의 (객체) : { sec_01: [강의1, 강의2], sec_02: [...] }
  const [loading, setLoading] = useState(true); //로딩상태(boolean) :uefalse
  const [activeTab, setActiveTab] = useState('intro');
  const handleTabClick = (e, tabId) => {
    e.preventDefault(); // <a> 태그의 기본 동작(페이지 이동/스크롤) 방지
    setActiveTab(tabId); // 현재 활성 탭 상태 업데이트
  };

  useEffect(() => {
    console.log('🔍 useEffect 실행됨');
    console.log('🔍 courseId:', courseId);

    const fetchCourseData = async () => {
      console.log('🔍 데이터 조회 시작');
      if (!courseId) {
        console.log('❌ courseId 없음');
        return;
      }
      try {
        // course 조회
        console.log('🔍 Firebase 조회 중...', courseId);
        const courseSnap = await getDoc(doc(db, 'courses', courseId));
        console.log('🔍 조회 완료:', courseSnap.exists());

        if (!courseSnap.exists()) {
          console.error('강좌를 찾을 수 없습니다');
          setLoading(false);
          return;
        }

        const courseData = courseSnap.data();
        setCourse(courseData);
        console.log('Course:', courseData);

        // section 조회 (course.section:Ids 가 있다고 확인 시)
        if (courseData.sectionIds && courseData.sectionIds.length > 0) {
          const sectionsData = [];
          for (const sectionId of courseData.sectionIds) {
            const sectionSnap = await getDoc(doc(db, 'sections', sectionId));
            if (sectionSnap.exists()) {
              sectionsData.push({ id: sectionSnap.id, ...sectionSnap.data() });
            }
          }

          //sequence 순서대로 정렬
          sectionsData.sort((a, b) => a.sequence - b.sequence);
          setSections(sectionsData);
          console.log('Sections:', sectionsData);

          // lectures 조회 (section.lectureIds 가 있다고 확인 시)
          const allLectures = {};
          for (const section of sectionsData) {
            if (section.lectureIds && section.lectureIds.length > 0) {
              const sectionLectures = [];
              for (const lectureId of section.lectureIds) {
                const lectureSnap = await getDoc(doc(db, 'lectures', lectureId));
                if (lectureSnap.exists()) {
                  sectionLectures.push({ id: lectureSnap.id, ...lectureSnap.data() });
                }
              }

              sectionLectures.sort((a, b) => a.sequence - b.sequence);
              allLectures[section.id] = sectionLectures;
            }
          }
          setLectures(allLectures);
          console.log('Lectures: ', allLectures);
        }
      } catch (error) {
        console.error('데이터 조회 실패', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  /*
            const snap = await getDoc(
        doc(db, 'courses', 'mnr24rUtaNwWWHbfhfVv'), // ✅ 여기!
      );
      setCourse(snap.data());
      console.log('불러온 데이터:', snap.data());
    };
    fetchCourse();
  }, []);
      */

  // ========== 로딩/에러 처리 ==========
  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (!course) {
    return <div className={styles.error}>강좌를 찾을 수 없습니다</div>;
  }

  // ========== 총 강의 수 계산 ==========
  const totalLectures = section.reduce((sum, sec) => sum + (lectures[sec.id]?.length || 0), 0);
  const handleEnrollClick = () => {
    if (course.isFree) {
      alert('무료 강좌 등록 완료!');
    } else {
      // 추후 장바구니/결제 페이지 이동 로직 연결 가능
    }
  };

  // ========== 렌더링 ==========
  return (
    <main className={`${styles['course-detail']} container`} aria-labelledby="course-detail-title">
      <div className={styles['course-detail__layout']}>
        {/* 1) 히어로: 레이아웃의 첫 자식 + 전체 폭 */}
        <div className={styles['course-detail__hero']} aria-hidden="true" />

        {/* 2) 좌측 본문 */}
        <article className={styles['course-detail__main']}>
          <header className={styles['course-detail__header']}>
            {/* ✅ Firebase 데이터 렌더링 */}
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
              <li className={styles['course-detail__meta-item']}>⭐ {course.level}</li>
            </ul>
            <p className={styles['course-detail__summary']}>“{course.summary}”</p>
          </header>

          {/* ========== 커리큘럼 섹션 ========== */}

          <nav className={styles['course-tabs']} aria-label="강좌 상세 탭">
            <ul className={styles['course-tabs__list']}>
              <li>
                <a
                  href="#intro"
                  className={`${styles['course-tabs__link']} ${activeTab === 'intro' ? styles['active'] : ''}`} // 💡 CSS 클래스 조건부 적용
                  aria-current={activeTab === 'intro' ? 'page' : undefined}
                  onClick={(e) => handleTabClick(e, 'intro')} // 💡 클릭 핸들러
                >
                  강좌 소개
                </a>
              </li>
              <li>
                <a
                  href="#curriculum"
                  className={`${styles['course-tabs__link']} ${activeTab === 'curriculum' ? styles['active'] : ''}`} // 💡 CSS 클래스 조건부 적용
                  aria-current={activeTab === 'curriculum' ? 'page' : undefined}
                  onClick={(e) => handleTabClick(e, 'curriculum')} // 💡 클릭 핸들러
                >
                  커리큘럼
                </a>
              </li>
              <li>
                <a
                  href="#instructor"
                  className={`${styles['course-tabs__link']} ${activeTab === 'instructor' ? styles['active'] : ''}`} // 💡 CSS 클래스 조건부 적용
                  aria-current={activeTab === 'instructor' ? 'page' : undefined}
                  onClick={(e) => handleTabClick(e, 'instructor')} // 💡 클릭 핸들러
                >
                  강사 정보
                </a>
              </li>
            </ul>
          </nav>

          {activeTab === 'intro' && ( // 💡 activeTab이 'intro'일 때만 렌더링
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
              {section.length === 0 ? (
                <p>커리큘럼이 없습니다</p>
              ) : (
                <div>
                  {section.map((sec) => (
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

        {/* 3) 우측 사이드바: 히어로 아래에서 시작 */}
        <aside className={styles['course-detail__aside']} aria-label="신청 영역">
          <div
            className={`${styles['sidebar']} ${styles['sidebar--right']} ${styles['sidebar--floating']}`}
          >
            <button
              id="course-apply-module-Btn"
              className={styles['course-detail__cta-button']}
              onClick={handleEnrollClick}
            >
              {course.isFree ? '무료 수강하기' : `₩${course.price.toLocaleString()} 수강하기`}
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
    </main>
  );
}
