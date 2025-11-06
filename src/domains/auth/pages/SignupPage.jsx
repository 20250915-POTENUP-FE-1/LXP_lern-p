import React from "react";
import styles from "./AuthPages.module.css";

export default function SignupPage() {
  return (
    <section className={styles["auth-page"]} aria-labelledby="signup-title">
      <h1 id="signup-title" className={styles["auth-page__title"]}>
        회원가입
      </h1>
      <form className={styles["auth-form"]} aria-label="회원가입 폼">
        <div className={styles["auth-form__field"]}>
          <label htmlFor="signup-name">이름</label>
          <input
            id="signup-name"
            type="text"
            className={styles["auth-form__input"]}
          />
        </div>
        <div className={styles["auth-form__field"]}>
          <label htmlFor="signup-email">이메일</label>
          <input
            id="signup-email"
            type="email"
            className={styles["auth-form__input"]}
          />
        </div>
        <div className={styles["auth-form__field"]}>
          <label htmlFor="signup-password">비밀번호</label>
          <input
            id="signup-password"
            type="password"
            className={styles["auth-form__input"]}
          />
        </div>
        <button className={styles["auth-form__submit"]}>회원가입</button>
      </form>
    </section>
  );
}
