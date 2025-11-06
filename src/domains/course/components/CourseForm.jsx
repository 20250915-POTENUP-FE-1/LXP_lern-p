import React from "react";
import styles from "./CourseForm.module.css";

export function CourseForm() {
  return (
    <form className={styles["course-form"]} aria-label="강좌 등록 폼">
      <div className={styles["course-form__grid"]}>
        <div className={styles["course-form__field"]}>
          <label
            htmlFor="course-title"
            className={styles["course-form__label"]}
          >
            강좌명{" "}
            <span className={styles["course-form__req"]} aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="course-title"
            type="text"
            className={styles["course-form__input"]}
            placeholder="예: React 입문"
          />
          <p className={styles["course-form__hint"]}>
            수강생이 쉽게 이해할 수 있는 제목을 입력하세요.
          </p>
        </div>

        <div className={styles["course-form__field"]}>
          <label
            htmlFor="course-category"
            className={styles["course-form__label"]}
          >
            카테고리
          </label>
          <select
            id="course-category"
            className={styles["course-form__select"]}
          >
            <option>프론트엔드</option>
            <option>백엔드</option>
            <option>데이터</option>
          </select>
        </div>

        <div className={styles["course-form__field"]}>
          <label
            htmlFor="course-level"
            className={styles["course-form__label"]}
          >
            난이도
          </label>
          <select id="course-level" className={styles["course-form__select"]}>
            <option>입문</option>
            <option>중급</option>
            <option>고급</option>
          </select>
        </div>

        <div className={styles["course-form__field--full"]}>
          <label htmlFor="course-desc" className={styles["course-form__label"]}>
            상세 설명
          </label>
          <textarea
            id="course-desc"
            rows="6"
            className={styles["course-form__textarea"]}
          />
        </div>

        <div className={styles["course-form__field"]}>
          <label
            htmlFor="course-price"
            className={styles["course-form__label"]}
          >
            가격(₩)
          </label>
          <input
            id="course-price"
            type="number"
            className={styles["course-form__input"]}
            inputMode="numeric"
          />
        </div>

        <div className={styles["course-form__field"]}>
          <label
            htmlFor="course-thumb"
            className={styles["course-form__label"]}
          >
            썸네일 URL
          </label>
          <input
            id="course-thumb"
            type="url"
            className={styles["course-form__input"]}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className={styles["course-form__actions"]}>
        <button className={styles["btn"]}>저장</button>
        <a href="/courses" className={styles["btn--ghost"]}>
          취소
        </a>
      </div>
    </form>
  );
}
