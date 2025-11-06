import React from "react";
import styles from "@/domains/user/pages/MyPageSections.module.css";

export default function Enrolled() {
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
        {/* 아이템(정적 마크업) */}
        <div className={styles["enrolled-card"]}>
          <h3 className={styles["enrolled-card__title"]}>React 완전정복</h3>
          <p className={styles["enrolled-card__meta"]}>카테고리: 프론트엔드</p>
          <div className={styles["progress"]} aria-label="진행률 60%">
            <div className={styles["progress__bar"]} style={{ width: "60%" }} />
          </div>
          <span className={styles["enrolled-card__percent"]}>60%</span>
        </div>

        <div className={styles["enrolled-card"]}>
          <h3 className={styles["enrolled-card__title"]}>TypeScript 기초</h3>
          <p className={styles["enrolled-card__meta"]}>카테고리: 프론트엔드</p>
          <div className={styles["progress"]} aria-label="진행률 30%">
            <div className={styles["progress__bar"]} style={{ width: "30%" }} />
          </div>
          <span className={styles["enrolled-card__percent"]}>30%</span>
        </div>
      </div>
    </article>
  );
}
