import React from "react";
import styles from "./AuthPages.module.css";

export default function SignInPage() {
  return (
    <section className={styles["auth-page"]} aria-labelledby="signin-title">
      <h1 id="signin-title" className={styles["auth-page__title"]}>
        로그인
      </h1>
      <form className={styles["form"]} aria-label="로그인 폼">
        <div className={styles["form__group"]}>
          <label htmlFor="signin-email" className={styles["form__label"]}>
            이메일
          </label>
          <input
            id="signin-email"
            type="email"
            className={styles["form__control"]}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        <div className={styles["form__group"]}>
          <label htmlFor="signin-password" className={styles["form__label"]}>
            비밀번호
          </label>
          <input
            id="signin-password"
            type="password"
            className={styles["form__control"]}
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요."
          />
          <div className={styles["form__actions"]}>
            <label>
              <input type="checkbox" name="remember" /> 로그인 상태 유지
            </label>
            <a className={styles["auth-page__link"]} href="/signin#reset">
              비밀번호 찾기
            </a>
          </div>
        </div>
        <button type="submit" className={styles["form__submit"]}>
          로그인
        </button>
      </form>
      <div className={styles["auth-page__actions"]}>
        아직 계정이 없으신가요?
        <a className={styles["auth-page__link"]} href="/signup">
          회원가입
        </a>
      </div>
    </section>
  );
}
