import React from "react";
import styles from "./AuthPages.module.css";

export default function SignupPage() {
  return (
    <section className={styles["auth-page"]} aria-labelledby="signup-title">
      <h1 id="signup-title" className={styles["auth-page__title"]}>
        회원가입
      </h1>
      <form className={styles["form"]} aria-label="회원가입 폼">
        <div className={styles["form__group"]}>
          <label htmlFor="signup-nickname" className={styles["form__label"]}>
            닉네임
          </label>
          <input
            id="signup-nickname"
            type="text"
            className={styles["form__control"]}
            autoComplete="nickname"
            placeholder="예: lernP_lover"
          />
          <p className={styles["form__help"]}>커뮤니티에 표시될 이름입니다.</p>
        </div>
        <div className={styles["form__group"]}>
          <label htmlFor="signup-email" className={styles["form__label"]}>
            이메일
          </label>
          <input
            id="signup-email"
            type="email"
            className={styles["form__control"]}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        <div className={styles["form__group"]}>
          <label htmlFor="signup-password" className={styles["form__label"]}>
            비밀번호
          </label>
          <input
            id="signup-password"
            type="password"
            className={styles["form__control"]}
            autoComplete="new-password"
            placeholder="8자 이상 영문과 숫자를 조합하세요."
          />
          <p className={styles["form__help"]}>
            안전한 비밀번호를 사용해주세요.
          </p>
        </div>
        <div className={styles["form__group"]} data-error="false">
          <label
            htmlFor="signup-password-confirm"
            className={styles["form__label"]}
          >
            비밀번호 확인
          </label>
          <input
            id="signup-password-confirm"
            type="password"
            className={styles["form__control"]}
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요."
          />
          <p className={styles["form__error"]} role="alert">
            비밀번호가 일치하지 않습니다.
          </p>
        </div>
        <div className={styles["form__group"]}>
          <span className={styles["form__label"]}>프로필 이미지</span>
          <div className={styles["upload"]} data-error="false">
            <div
              className={styles["upload__preview"]}
              aria-label="업로드된 프로필 이미지 미리보기"
            >
              1:1
            </div>
            <button type="button" className={styles["upload__trigger"]}>
              이미지 선택
            </button>
            <p className={styles["upload__hint"]}>
              1:1 비율의 JPG, PNG (최대 3MB)
            </p>
            <p className={styles["upload__error"]} role="alert">
              지원하지 않는 파일 형식입니다.
            </p>
          </div>
        </div>
        <button type="submit" className={styles["form__submit"]}>
          회원가입
        </button>
      </form>
      <div className={styles["auth-page__actions"]}>
        이미 계정이 있으신가요?
        <a className={styles["auth-page__link"]} href="/signin">
          로그인하기
        </a>
      </div>
    </section>
  );
}
