import { useAuthState } from "@/domains/auth/hooks/useAuthState";
import styles from "@/domains/user/pages/MyPageSections.module.css";
import { getInstructorCourses } from "@/domains/user/services/instructorService";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

export default function InstructorCourses() {
  const { user, loading: userLoading } = useAuthState();
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // user.id 준비된 뒤 → 데이터 가져오기
    useEffect(() => {
    if (userLoading || !user?.id) return;
    setCoursesLoading(true);
    getInstructorCourses(user.id)
      .then(setCourses)
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setCoursesLoading(false));
  }, [user?.id, userLoading]);

  // 로딩 UI
  if (userLoading || coursesLoading) {
    return <div style={{ padding: "40px" }}>⏳ 강좌 불러오는 중...</div>;
  }

  // 강좌 없을 때 UI
  if (courses.length === 0) {
    return <div style={{ padding: "40px" }}>🫠 개설한 강의가 아직 없어요.</div>;
  }

  return (
    <article
      className={styles["authored-section"]}
      aria-labelledby="mypage-instructor-courses-title"
    >
      <h1 id="mypage-instructor-courses-title" className={styles["profile-section__title"]}>
        내가 등록한 강의
      </h1>

      <div className={styles["authored__actions"]}>
        <a
          href="/courses/create"
          data-modal-target="#instructor-request-modal"
          data-requires-role="instructor"
          className={`${styles["authored__btn"]} ${styles["authored__btn--primary"]}`}
        >
          내 강좌 만들기
        </a>
      </div>

      <div className={styles["authored"]}>
        {courses.map((course) => (
          <div key={course.id} className={styles["authored__item"]}>
            <NavLink to={`/courses/${course.id}`}>
              <div className={styles["authored__meta"]}>
                <h3 className={styles["authored__title"]}>{course.title}</h3>
                <p className={styles["authored__category"]}>
                  {Array.isArray(course.category)
                    ? course.category.join(" / ")
                    : course.category ?? "카테고리 없음"}
                </p>
              </div>
            </NavLink>
            <div className={styles["authored__actions"]}>
              <NavLink to={`/courses/${course.id}/edit`} className={styles["authored__btn"]}>수정</NavLink>
              <button type="button" className={`${styles["authored__btn"]} ${styles["authored__btn--delete"]}`}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
