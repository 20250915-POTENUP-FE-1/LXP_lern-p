import React from "react";
import styles from "./CourseForm.module.css";

export function CourseForm() {
  return (
    <form className={styles["course-form"]} aria-label="강좌 등록 폼">
      <div className={styles["form-grid"]}>
        <div className={styles["form-grid__main"]}>
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
            <select
              id="course-level"
              className={styles["course-form__select"]}
            >
              <option>입문</option>
              <option>중급</option>
              <option>고급</option>
            </select>
          </div>

          <div
            className={`${styles["course-form__field"]} ${styles["course-form__field--full"]}`}
          >
            <label
              htmlFor="course-desc"
              className={styles["course-form__label"]}
            >
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
        </div>

        <aside className={styles["upload-card"]}>
          <label htmlFor="course-thumb" className={styles["form__label"]}>
            썸네일 URL
          </label>
          <input
            id="course-thumb"
            type="url"
            className={styles["form__control"]}
            placeholder="https://..."
          />
          <div className={styles["upload__preview"]} aria-hidden="true">
            16:11
          </div>
          <div className={styles["upload__actions"]}>
            <button type="button" className={styles["upload__button"]}>
              파일 선택
            </button>
            <button type="button" className={styles["upload__button"]}>
              미리보기
            </button>
          </div>
          <p className={styles["upload__hint"]}>
            16:11 비율의 JPG 또는 PNG 파일(최대 5MB)을 업로드하세요.
          </p>
          <p className={styles["upload__error"]}>지원하지 않는 파일 형식입니다.</p>
        </aside>
      </div>

      <div className={styles["form-actions"]}>
        <button type="submit" className={`${styles["btn"]} ${styles["btn--primary"]}`}>
          저장
        </button>
        <a
          href="/courses"
          className={`${styles["btn"]} ${styles["btn--ghost"]}`}
        >
          취소
        </a>
      </div>

      <section className={styles["sections"]} aria-label="섹션 구성">
        <header className={styles["section-list__header"]}>
          <h2 className={styles["section-list__title"]}>섹션 1. 강좌 소개</h2>
          <div className={styles["section-list__actions"]}>
            <button type="button" className={styles["section-list__action"]}>
              섹션 수정
            </button>
            <button type="button" className={styles["section-list__action"]}>
              섹션 삭제
            </button>
          </div>
        </header>

        <ul className={styles["lecture-list"]}>
          <li className={styles["lecture-list__item"]}>
            <div>
              <strong className={styles["lecture-list__title"]}>
                1-1. 오리엔테이션
              </strong>
              <p className={styles["lecture-list__meta"]}>05:32</p>
            </div>
            <div className={styles["lecture-list__actions"]}>
              <button
                type="button"
                className={styles["lecture-list__action"]}
              >
                편집
              </button>
              <button
                type="button"
                className={`${styles["lecture-list__action"]} ${styles["lecture-list__action--danger"]}`}
              >
                삭제
              </button>
            </div>
          </li>
          <li className={styles["lecture-list__item"]}>
            <div>
              <strong className={styles["lecture-list__title"]}>
                1-2. 개발 환경 설정
              </strong>
              <p className={styles["lecture-list__meta"]}>12:10</p>
            </div>
            <div className={styles["lecture-list__actions"]}>
              <button
                type="button"
                className={styles["lecture-list__action"]}
              >
                편집
              </button>
              <button
                type="button"
                className={`${styles["lecture-list__action"]} ${styles["lecture-list__action--danger"]}`}
              >
                삭제
              </button>
            </div>
          </li>
        </ul>

        <div className={styles["section-list__actions"]}>
          <button type="button" className={styles["section-list__action"]}>
            + 강의 추가
          </button>
        </div>
      </section>

      <div className={styles["section-list__footer"]}>
        <button type="button" className={styles["section-list__action"]}>
          + 새 섹션 만들기
        </button>
      </div>
    </form>
  );
}
