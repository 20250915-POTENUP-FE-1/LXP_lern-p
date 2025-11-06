import React from "react";
import styles from "./CourseCard.module.css";

export function CourseCard() {
  return (
    <article
      className={styles["course-card"]}
      aria-labelledby="course-card-title"
    >
      <a
        href="/courses/placeholder"
        className={styles["course-card__thumb-link"]}
      >
        <img
          className={styles["course-card__thumb"]}
          src="https://via.placeholder.com/480x270"
          alt="React 입문 강좌 썸네일"
          loading="lazy"
        />
      </a>
      <div className={styles["course-card__body"]}>
        <h3 id="course-card-title" className={styles["course-card__title"]}>
          <a
            className={styles["course-card__title-link"]}
            href="/courses/placeholder"
          >
            React 입문
          </a>
        </h3>
        <p className={styles["course-card__meta"]}>강사: 홍길동 • 입문</p>
        <div className={styles["course-card__foot"]}>
          <span className={styles["course-card__price"]}>₩49,000</span>
          <a className={styles["course-card__cta"]} href="/courses/placeholder">
            자세히 보기
          </a>
        </div>
      </div>
    </article>
  );
}
