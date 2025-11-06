import React from "react";
import styles from "@/domains/user/pages/MyPageSections.module.css";

export default function InstructorCourses() {
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
        <div className={styles["authored__item"]}>
          <div className={styles["authored__meta"]}>
            <h3 className={styles["authored__title"]}>React 실전 프로젝트</h3>
            <p className={styles["authored__category"]}>
              프론트엔드 / React / 실전
            </p>
          </div>
          <div className={styles["authored__actions"]}>
            <a href="/courses/placeholder/edit" className={styles["authored__btn"]}>
              수정
            </a>
            <button type="button" className={`${styles["authored__btn"]} ${styles["authored__btn--delete"]}`}>
              삭제
            </button>
          </div>
        </div>

        <div className={styles["authored__item"]}>
          <div className={styles["authored__meta"]}>
            <h3 className={styles["authored__title"]}>Node.js 백엔드 구조</h3>
            <p className={styles["authored__category"]}>
              백엔드 / Node.js / 중급
            </p>
          </div>
          <div className={styles["authored__actions"]}>
            <a href="/courses/placeholder/edit" className={styles["authored__btn"]}>
              수정
            </a>
            <button type="button" className={`${styles["authored__btn"]} ${styles["authored__btn--delete"]}`}>
              삭제
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
