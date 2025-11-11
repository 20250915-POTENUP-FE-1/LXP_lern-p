import styles from "@/domains/user/pages/MyPageSections.module.css";
import { auth } from "@/shared/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchEnrolledCourses } from "../services/enrolledService";

export default function Enrolled() {

  const [user, setUser] = useState(null);
  const [enrolledList, setEnrolledList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) 로그인 상태 감지 (로그인하면 user 업데이트)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [])

  // 2) user.uid 가 생기면 → 해당 유저 수강 목록(enrolled) 가져오기
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    fetchEnrolledCourses(user.uid)
      .then((data) => setEnrolledList(data))
      .finally(() => setLoading(false));
  }, [user]);

  // 로딩 UI
  if (loading) {
    return <div style={{ padding: "40px" }}>⏳ 내 수강 강좌 불러오는 중...</div>;
  }

  // 수강 목록 없을 때
  if (enrolledList.length === 0) {
    return <div style={{ padding: "40px" }}>🫠 수강 중인 강의가 없어요.</div>;
  }

  return (
    <article
      className={styles["enrolled-section"]}
      aria-labelledby="mypage-enrolled-title"
    >
      <h1
        id="mypage-enrolled-title"
        className={styles["enrolled-section__title"]}
      >
        수강 중인 강좌
      </h1>

      <div className={styles["enrolled-section__list"]}>
        {enrolledList.map((item)=>(
          <div key={item.id} className={styles["enrolled-card"]}>
          <Link
            to={`/courses/${item.courseId}`}
            className={styles["enrolled__link"]}
          >
            <h3 className={styles["enrolled__title"]}>{item.course?.title ?? "제목 없음"}</h3>
            <p className={styles["enrolled__category"]}>
              {Array.isArray(item.course?.category)
                ? item.course.category.join(" / ")
                : item.course?.category ?? "카테고리 없음"}
            </p>
          </Link>
          <div className={styles["progress"]} aria-label={`${item.progress ?? 0}%`}>
            <div className={styles["progress__bar"]} style={{ width: `${item.progress ?? 0}%` }} />
          </div>
          <span className={styles["enrolled-card__percent"]}>{`${item.progress ?? 0}%`}</span>
        </div>
        ))}
        
      </div>
    </article>
  );
}
