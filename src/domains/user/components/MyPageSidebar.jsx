import React from "react";
import styles from "@/domains/user/components/MyPageSidebar.module.css";

/** Block: mypage-tabs (named export) */
export function MyPageSidebar() {
  return (
    <nav className={styles["mypage-tabs"]} aria-label="마이페이지 탭">
      {/* 기본 탭 */}
      <ul className={styles["mypage-tabs__list"]}>
        <li className={styles["mypage-tabs__item"]}>
          <a
            href="/mypage"
            className={styles["mypage-tabs__link"]}
            aria-current="page"
          >
            내 정보
          </a>
        </li>
        <li className={styles["mypage-tabs__item"]}>
          <a href="/mypage/enrolled" className={styles["mypage-tabs__link"]}>
            수강 중인 강좌
          </a>
        </li>
      </ul>

      {/* 강사 전용 섹션 */}
      <div
        className={`${styles["mypage-tabs__section"]} ${styles["mypage-tabs__section--instructor"]}`}
        aria-label="강사 전용"
      >
        <h4 className={styles["mypage-tabs__section-title"]}>강사</h4>
        <ul className={styles["mypage-tabs__list"]}>
          <li className={styles["mypage-tabs__item"]}>
            <a
              href="/mypage/instructor/courses"
              className={styles["mypage-tabs__link"]}
            >
              내 강좌
            </a>
          </li>
          <li className={styles["mypage-tabs__item"]}>
            <a
              href="/mypage/instructor/create"
              className={styles["mypage-tabs__link"]}
            >
              강좌 만들기
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
