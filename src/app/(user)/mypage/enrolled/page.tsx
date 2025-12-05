"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/domains/user/pages/MyPageSections.module.css";
import { useAuthState } from "@/domains/auth/hooks/useAuthState";
import { getEnrolledCourses } from "@/domains/user/services/enrolledService";
import type { EnrolledCourse } from "@/domains/user/types/enrolled"; // 타입이 있다면

export default function Enrolled() {
  const {user, loading: userLoading } = useAuthState();
  const [enrolledLoading, setEnrolledLoading] = useState<boolean>(false);
  const [enrolledList, setEnrolledList] = useState<EnrolledCourse[]>([]);

  // 🟨 ⭐ 임시 로그인 user 주입 (나중에 이 한 줄만 지우면 끝!)
  const mockUser = { id: "FeHOKS4qexPuTfOEZy4q5g9A0vU2", name: "김오리", email: "duck@example.com", createdAt: "2025-01-01" };
  const _user = user ?? mockUser; // ← 지울 줄: 이 한 줄만 삭제하면 기존 구조 그대로

  /**
   * user.id가 생기면 → 해당 유저 수강 목록 가져오기
   */
  useEffect(() => {
    if (userLoading || !_user?.id) return;

    (async () => {
      setEnrolledLoading(true);
      try {
        const data = await getEnrolledCourses(_user.id);
        setEnrolledList(data);
      } catch (err) {
        console.error("❌ 수강 목록 가져오기 실패:", err);
      } finally {
        setEnrolledLoading(false);
      }
    })();
  }, [userLoading, _user?.id]);

  /**
   * 로딩 UI
   */
  if (userLoading || enrolledLoading) {
    return <div style={{ padding: "40px" }}>⏳ 내 수강 강좌 불러오는 중...</div>;
  }

  /**
   * 수강 목록 없는 경우
   */
  if (enrolledList.length === 0) {
    return <div style={{ padding: "40px" }}>🫠 수강 중인 강의가 없어요.</div>;
  }

  return (
    <article className={styles["enrolled-section"]} aria-labelledby="mypage-enrolled-title">
      <h1 id="mypage-enrolled-title" className={styles["enrolled-section__title"]}>
        수강 중인 강좌
      </h1>

      <div className={styles["enrolled-section__list"]}>
        {enrolledList.map((item) => (
          <div key={item.id} className={styles["enrolled-card"]}>
            <Link
              href={`/courses/${item.courseId}`}
              className={styles["enrolled__link"]}
            >
              <h3 className={styles["enrolled__title"]}>
                {item.course?.title ?? "제목 없음"}
              </h3>

              <p className={styles["enrolled__category"]}>
                {Array.isArray(item.course?.category)
                  ? item.course.category.join(" / ")
                  : item.course?.category ?? "카테고리 없음"}
              </p>
            </Link>

            <div
              className={styles["progress"]}
              aria-label={`${item.progress ?? 0}%`}
            >
              <div
                className={styles["progress__bar"]}
                style={{ width: `${item.progress ?? 0}%` }}
              />
            </div>

            <span className={styles["enrolled-card__percent"]}>
              {`${item.progress ?? 0}%`}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
