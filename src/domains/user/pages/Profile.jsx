import React from "react";
import styles from "@/domains/user/pages/MyPageSections.module.css";

export default function Profile() {
  return (
    <article
      className={styles["profile-section"]}
      aria-labelledby="mypage-profile-title"
    >
      <h1
        id="mypage-profile-title"
        className={styles["profile-section__title"]}
      >
        내 정보
      </h1>

      {/* 프로필 헤더 카드 */}
      <section
        className={styles["profile-section__header-card"]}
        aria-label="프로필 요약"
      >
        <div className={styles["profile-section__avatar"]} aria-hidden="true" />
        <div className={styles["profile-section__identity"]}>
          <h2 className={styles["profile-section__name"]}>김코딩님</h2>
          <p className={styles["profile-section__email"]}>user@email.com</p>
          <p className={styles["profile-section__since"]}>가입일: 2025.01.15</p>
        </div>
      </section>

      {/* 상세 정보 카드 */}
      <div className={styles["profile-section__card"]}>
        <div className={styles["profile-section__row"]}>
          <span className={styles["profile-section__label"]}>이름</span>
          <span className={styles["profile-section__value"]}>김코딩</span>
        </div>
        <div
          className={styles["profile-section__divider"]}
          aria-hidden="true"
        />
        <div className={styles["profile-section__row"]}>
          <span className={styles["profile-section__label"]}>이메일</span>
          <span className={styles["profile-section__value"]}>
            user@email.com
          </span>
        </div>
        <div
          className={styles["profile-section__divider"]}
          aria-hidden="true"
        />
        <div className={styles["profile-section__row"]}>
          <span className={styles["profile-section__label"]}>가입일</span>
          <span className={styles["profile-section__value"]}>
            2025년 1월 15일
          </span>
        </div>
      </div>
    </article>
  );
}
