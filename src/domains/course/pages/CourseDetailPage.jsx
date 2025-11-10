import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { db } from '../../../shared/lib/firebase/firestore';
import CourseApply from '../components/CourseApply';
import styles from './CourseDetailPage.module.css';

export default function CourseDetailPage() {
  const { courseId } = useParams(); //URL 에서 id : c_101 추출
  const navigate = useNavigate();

  const auth = getAuth();
  // 로그인 상태 변수
  const [currentUser, setCurrentUser] = useState(null);
  // 오픈 모달 상태
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const [course, setCourse] = useState(null); //강좌1개 : { title: "React 입문", ... }
  const [section, setSections] = useState([]); //섹션 여러개(배열) : [{ id: "sec_01", title: "..." }, ...]
  const [lectures, setLectures] = useState({}); // 섹션별 강의 (객체) : { sec_01: [강의1, 강의2], sec_02: [...] }
  const [loading, setLoading] = useState(true); //로딩상태(boolean) :uefalse
  const [activeTab, setActiveTab] = useState('intro');
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  //컴포넌트 마운트 시 로그인 상태 구독
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsub();
  }, [auth]);

  // 강의 수강여부 확인 로직
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (currentUser && courseId) {
        try {
          const userDocSnap = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const enrolled = userData.enrolledCourses?.some((item) => item.courseId === courseId);
            setIsEnrolled(enrolled || false);
          } else {
            setIsEnrolled(false);
          }
        } catch (error) {
          console.error('수강 상태 확인 실패 : ', error);
          setIsEnrolled(false);
        }
      } else {
        setIsEnrolled(false);
      }
    };
    checkEnrollmentStatus();
  }, [currentUser, courseId]);

  // 강의 클릭 안정성
  const handleTabClick = (e, tabId) => {
    e.preventDefault(); // <a> 태그의 기본 동작(페이지 이동/스크롤) 방지
    setActiveTab(tabId); // 현재 활성 탭 상태 업데이트
  };

  //강의 상세보기
  //course 내용 불러오기
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        return;
      }
      try {
        // course 조회

        const courseSnap = await getDoc(doc(db, 'courses', courseId));

        if (!courseSnap.exists()) {
          setLoading(false);
          return;
        }

        const courseData = courseSnap.data();
        setCourse(courseData);

        // section 컬렉션에서 courseId 로 필터
        const sectionSnap = await getDocs(collection(db, 'sections'));
        const allSections = sectionSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // 해당 코스의 섹션만 필터링 + sequence 순서 정렬
        const courseSections = allSections
          .filter((sec) => sec.courseId === courseId)
          .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

        setSections(courseSections);

        // lectures 컬렉션 전체 조회 → 섹션별로 묶기
        // lectures 조회 (section.lectureIds 가 있다고 확인 시)
        const lectureSnap = await getDocs(collection(db, 'lectures'));
        const allLectures = lectureSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const lectureMap = {};

        for (const sec of courseSections) {
          lectureMap[sec.id] = allLectures
            .filter((lec) => lec.sectionId === sec.id)

            .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
        }
        setLectures(lectureMap);
      } catch (error) {
        console.error('데이터 조회 실패', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  // 강의 신청하기
  const handleEnrolledCourse = async () => {
    // 로그인 확인
    if (!currentUser) {
      alert('로그인 필요합니다');
      setShowEnrollModal(false);
      navigate('/#login-modal');
      return;
    }
    setEnrolling(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);

      await updateDoc(userRef, {
        enrolledCourses: arrayUnion({
          courseId: courseId,
          progress: 0,
          enrolledAt: new Date().toISOString(),
        }),
        updatedAt: new Date().toISOString(),
      });
      setIsEnrolled(true);
      setShowEnrollModal(false);
    } catch (error) {
      alert('강의 신청에 실패하셨습니다');
    } finally {
      setEnrolling(false);
    }
  };

  const handleEnrollClick = () => {
    if (!course) {
      console.log(' course 없음');
      return;
    }

    if (course.isFree) {
      console.log('무료 강좌 → 로그인 모달');
      setShowLoginModal(true);
      return;
    }

    // 유료 강좌
    console.log('유료 강좌 → 신청 모달');
    setShowEnrollModal(true);
    console.log('setShowEnrollModal(true) 호출 완료');
  };

  // ========== 로딩/에러 처리 ==========
  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (!course) {
    return <div className={styles.error}>강좌를 찾을 수 없습니다</div>;
  }

  // ========== 총 강의 수 계산 ==========
  const totalLectures = section.reduce((sum, sec) => sum + (lectures[sec.id]?.length || 0), 0); // 총강의 수
  // 총 시간(분)
  const totalMinutes = section.reduce((acc, sec) => {
    const list = lectures[sec.id] || [];
    const mins = list.reduce((s, lec) => s + (Number(lec.duration) || 0), 0);
    return acc + mins;
  }, 0);

  // ========== 렌더링 ==========
  return (
    <main className={`${styles['course-detail']} container`} aria-labelledby="course-detail-title">
      <div className={styles['course-detail__layout']}>
        {/* 1) 히어로: 레이아웃의 첫 자식 + 전체 폭 */}
        <div className={styles['course-detail__hero']} aria-hidden="true" />

        {/* 2) 좌측 본문 */}
        <article className={styles['course-detail__main']}>
          <header className={styles['course-detail__header']}>
            {/*Firebase 데이터 렌더링 */}
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
                  onClick={(e) => handleTabClick(e, 'intro')} // 클릭 핸들러
                >
                  강좌 소개
                </a>
              </li>
              <li>
                <a
                  href="#curriculum"
                  className={`${styles['course-tabs__link']} ${activeTab === 'curriculum' ? styles['active'] : ''}`} // 💡 CSS 클래스 조건부 적용
                  aria-current={activeTab === 'curriculum' ? 'page' : undefined}
                  onClick={(e) => handleTabClick(e, 'curriculum')} // 클릭 핸들러
                >
                  커리큘럼
                </a>
              </li>
              <li>
                <a
                  href="#instructor"
                  className={`${styles['course-tabs__link']} ${activeTab === 'instructor' ? styles['active'] : ''}`} // 💡 CSS 클래스 조건부 적용
                  aria-current={activeTab === 'instructor' ? 'page' : undefined}
                  onClick={(e) => handleTabClick(e, 'instructor')} // 클릭 핸들러
                >
                  강사 정보
                </a>
              </li>
            </ul>
          </nav>

          {activeTab === 'intro' && ( // activeTab이 'intro'일 때만 렌더링
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
            <h4>금액 ₩ {course.price.toLocaleString()}</h4>
            {/*수강 여부에 따라 버튼 달라짐*/}
            <button
              id="course-apply-module-Btn"
              className={`${styles['course-detail__cta-button']} ${
                isEnrolled ? styles['course-detail__cta-button--enrolled'] : ''
              }`}
              onClick={handleEnrollClick}
              disabled={isEnrolled === 0} // ✅ 0일 때 비활성화
            >
              {isEnrolled === 0 ? '수강 불가' : '수강 신청'}
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

      <CourseApply
        open={showEnrollModal}
        course={course}
        totalLectures={totalLectures}
        totalMinutes={totalMinutes || course.duration || 0}
        enrolling={enrolling}
        onCancel={() => setShowEnrollModal(false)}
        onConfirm={handleEnrolledCourse}
        isEnrolled={isEnrolled}
      />
    </main>
  );
}
