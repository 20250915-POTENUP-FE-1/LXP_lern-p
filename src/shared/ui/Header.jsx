import React from "react";
import styles from "./Header.module.css";

export function Header() {
  return (
    <>
      <a href="#main-content" className={styles["skip-link"]}>
        본문으로 건너뛰기
      </a>

      {/* 상태 훅: 필요에 따라 header--authed, header--instructor 추가 */}
      <header
        className={styles["header"]}
        role="banner"
        aria-label="상단 내비게이션"
      >
        <div className={styles["header__inner"]}>
          {/* 좌측: 로고 */}
          <div className={styles["header__left"]}>
            <a
              href="/"
              className={styles["header__logo"]}
              aria-label="홈으로 이동"
            >
              <span className={styles["header__logo-text"]}>lernP</span>
            </a>
          </div>

          {/* 가운데 비움 */}
          <div className={styles["header__center"]} aria-hidden="true" />

          {/* 우측: 액션 + 프로필 */}
          <div className={styles["header__right"]}>
            {/* 게스트: 로그인 */}
            <a className={styles["header__action-link"]} href="#login-modal">
              로그인
            </a>

            {/* 로그인(O) & 강사권한(X): 권한 요청 */}
            <a
              className={styles["header__action-ghost"]}
              href="#role-request-modal"
            >
              강사 권한 요청
            </a>

            {/* 로그인(O) & 강사권한(O): 강좌 등록 */}
            <a className={styles["header__action-cta"]} href="/courses/create">
              강좌 등록하기
            </a>

            {/* 로그인(O): 프로필(마이페이지) */}
            <a
              className={styles["header__profile"]}
              href="/mypage"
              aria-label="마이페이지"
            >
              <span className={styles["header__avatar"]} aria-hidden="true">
                ME
              </span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
