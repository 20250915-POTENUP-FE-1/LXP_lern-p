import React from "react";
import styles from "./CourseDetailPage.module.css";

export default function CourseDetailPage() {
  return (
    <main
      className={styles["course-detail"]}
      aria-labelledby="course-detail-title"
    >
      <div className={styles["course-detail__layout"]}>
        {/* 1) 히어로: 레이아웃의 첫 자식 + 전체 폭 */}
        <div className={styles["course-detail__hero"]} aria-hidden="true" />

        {/* 2) 좌측 본문 */}
        <article className={styles["course-detail__main"]}>
          <header className={styles["course-detail__header"]}>
            <h1
              id="course-detail-title"
              className={styles["course-detail__title"]}
            >
              React 완전정복
            </h1>
            <p className={styles["course-detail__instructor"]}>김코딩 강사</p>
            <ul
              className={styles["course-detail__tags"]}
              aria-label="강좌 태그"
            >
              <li className={styles["course-detail__tag"]}>#프론트엔드</li>
              <li className={styles["course-detail__tag"]}>#React</li>
              <li className={styles["course-detail__tag"]}>#JavaScript</li>
            </ul>
            <ul
              className={styles["course-detail__meta"]}
              aria-label="강좌 정보"
            >
              <li className={styles["course-detail__meta-item"]}>
                👥 120명 수강중
              </li>
              <li className={styles["course-detail__meta-item"]}>⭐ 초급</li>
              <li className={styles["course-detail__meta-item"]}>
                📅 8주 과정
              </li>
            </ul>
            <p className={styles["course-detail__summary"]}>
              “React의 기초부터 실전 프로젝트까지 단계별로 학습합니다”
            </p>
          </header>

          <nav
            className={styles["course-detail-tabs"]}
            aria-label="강좌 상세 탭"
          >
            <ul className={styles["course-detail-tabs__list"]}>
              <li className={styles["course-detail-tabs__item"]}>
                <a
                  href="#intro"
                  className={styles["course-detail-tabs__link"]}
                  aria-current="page"
                >
                  강좌 소개
                </a>
              </li>
              <li className={styles["course-detail-tabs__item"]}>
                <a
                  href="#curriculum"
                  className={styles["course-detail-tabs__link"]}
                >
                  커리큘럼
                </a>
              </li>
              <li className={styles["course-detail-tabs__item"]}>
                <a
                  href="#instructor"
                  className={styles["course-detail-tabs__link"]}
                >
                  강사 정보
                </a>
              </li>
            </ul>
          </nav>

          <section
            id="intro"
            className={styles["course-detail__section"]}
            aria-labelledby="intro-title"
          >
            <h2
              id="intro-title"
              className={styles["course-detail__section-title"]}
            >
              강좌 개요
            </h2>
            <p className={styles["course-detail__paragraph"]}>
              이 강좌는 React의 기본 개념부터 실전 프로젝트까지 다룹니다…
            </p>
          </section>

          <section
            id="curriculum"
            className={styles["course-detail__section"]}
            aria-labelledby="curriculum-title"
          >
            <h2
              id="curriculum-title"
              className={styles["course-detail__section-title"]}
            >
              커리큘럼
            </h2>
            <p className={styles["course-detail__paragraph"]}>
              커리큘럼 상세는 추후 업데이트 예정
            </p>
          </section>

          <section
            id="instructor"
            className={styles["course-detail__section"]}
            aria-labelledby="instructor-title"
          >
            <h2
              id="instructor-title"
              className={styles["course-detail__section-title"]}
            >
              강사 정보
            </h2>
            <p className={styles["course-detail__paragraph"]}>
              강사 소개는 추후 업데이트 예정
            </p>
          </section>
        </article>

        {/* 3) 우측 사이드바: 히어로 아래에서 시작 */}
        <aside
          className={styles["course-detail__aside"]}
          aria-label="신청 영역"
        >
          <div className={styles["floating-cta"]}>
            <a
              href="#course-apply-modal"
              className={styles["floating-cta__button"]}
            >
              신청하기
            </a>
            <ul className={styles["floating-cta__meta-list"]}>
              <li className={styles["floating-cta__meta-row"]}>
                <span className={styles["floating-cta__meta-label"]}>강사</span>
                <span className={styles["floating-cta__meta-value"]}>
                  김코딩
                </span>
              </li>
              <li
                className={styles["floating-cta__divider"]}
                aria-hidden="true"
              />
              <li className={styles["floating-cta__meta-row"]}>
                <span className={styles["floating-cta__meta-label"]}>
                  총 강의
                </span>
                <span className={styles["floating-cta__meta-value"]}>12강</span>
              </li>
              <li
                className={styles["floating-cta__divider"]}
                aria-hidden="true"
              />
              <li className={styles["floating-cta__meta-row"]}>
                <span className={styles["floating-cta__meta-label"]}>
                  총 시간
                </span>
                <span className={styles["floating-cta__meta-value"]}>
                  5시간 20분
                </span>
              </li>
              <li
                className={styles["floating-cta__divider"]}
                aria-hidden="true"
              />
              <li className={styles["floating-cta__meta-row"]}>
                <span className={styles["floating-cta__meta-label"]}>
                  난이도
                </span>
                <span className={styles["floating-cta__meta-value"]}>초급</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
