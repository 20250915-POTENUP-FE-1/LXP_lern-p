import React from "react";
import styles from "./FilterSidebar.module.css";

/**
 * BEM Block: filter-sidebar
 * - Desktop/Tablet: nav.filter-sidebar (sticky floating)
 * - Mobile: details.filter-sidebar__mobile (collapsible)
 */
export function FilterSidebar() {
  return (
    <>
      {/* Desktop/Tablet: Floating sticky sidebar */}
      <nav
        className={styles["filter-sidebar"]}
        aria-label="카테고리 및 난이도 필터"
      >
        <h2 className={styles["filter-sidebar__title"]}>필터</h2>

        {/* 섹션: 카테고리 (3 depth) */}
        <section
          className={`${styles["filter-sidebar__section"]} ${styles["filter-sidebar__section--category"]}`}
          aria-labelledby="filter-cat-title"
        >
          <h3
            id="filter-cat-title"
            className={styles["filter-sidebar__section-title"]}
          >
            카테고리
          </h3>

          <ul
            className={`${styles["filter-sidebar__list"]} ${styles["filter-sidebar__list--level1"]}`}
          >
            <li className={styles["filter-sidebar__item"]}>
              <a
                href="/?cat=frontend"
                className={styles["filter-sidebar__link"]}
              >
                프론트엔드
              </a>
              <ul
                className={`${styles["filter-sidebar__list"]} ${styles["filter-sidebar__list--level2"]}`}
              >
                <li className={styles["filter-sidebar__item"]}>
                  <a
                    href="/?cat=frontend-react"
                    className={styles["filter-sidebar__link"]}
                  >
                    React
                  </a>
                  <ul
                    className={`${styles["filter-sidebar__list"]} ${styles["filter-sidebar__list--level3"]}`}
                  >
                    <li className={styles["filter-sidebar__item"]}>
                      <a
                        href="/?cat=frontend-react-beginner"
                        className={styles["filter-sidebar__link"]}
                        aria-current="page"
                      >
                        입문
                      </a>
                    </li>
                    <li className={styles["filter-sidebar__item"]}>
                      <a
                        href="/?cat=frontend-react-intermediate"
                        className={styles["filter-sidebar__link"]}
                      >
                        중급
                      </a>
                    </li>
                    <li className={styles["filter-sidebar__item"]}>
                      <a
                        href="/?cat=frontend-react-advanced"
                        className={styles["filter-sidebar__link"]}
                      >
                        고급
                      </a>
                    </li>
                  </ul>
                </li>

                <li className={styles["filter-sidebar__item"]}>
                  <a
                    href="/?cat=frontend-vue"
                    className={styles["filter-sidebar__link"]}
                  >
                    Vue
                  </a>
                  <ul
                    className={`${styles["filter-sidebar__list"]} ${styles["filter-sidebar__list--level3"]}`}
                  >
                    <li className={styles["filter-sidebar__item"]}>
                      <a
                        href="/?cat=frontend-vue-beginner"
                        className={styles["filter-sidebar__link"]}
                      >
                        입문
                      </a>
                    </li>
                    <li className={styles["filter-sidebar__item"]}>
                      <a
                        href="/?cat=frontend-vue-intermediate"
                        className={styles["filter-sidebar__link"]}
                      >
                        중급
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            <li className={styles["filter-sidebar__item"]}>
              <a
                href="/?cat=backend"
                className={styles["filter-sidebar__link"]}
              >
                백엔드
              </a>
              <ul
                className={`${styles["filter-sidebar__list"]} ${styles["filter-sidebar__list--level2"]}`}
              >
                <li className={styles["filter-sidebar__item"]}>
                  <a
                    href="/?cat=backend-spring"
                    className={styles["filter-sidebar__link"]}
                  >
                    Spring
                  </a>
                  <ul
                    className={`${styles["filter-sidebar__list"]} ${styles["filter-sidebar__list--level3"]}`}
                  >
                    <li className={styles["filter-sidebar__item"]}>
                      <a
                        href="/?cat=backend-spring-beginner"
                        className={styles["filter-sidebar__link"]}
                      >
                        입문
                      </a>
                    </li>
                    <li className={styles["filter-sidebar__item"]}>
                      <a
                        href="/?cat=backend-spring-intermediate"
                        className={styles["filter-sidebar__link"]}
                      >
                        중급
                      </a>
                    </li>
                    <li className={styles["filter-sidebar__item"]}>
                      <a
                        href="/?cat=backend-spring-advanced"
                        className={styles["filter-sidebar__link"]}
                      >
                        고급
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </section>

        {/* 섹션: 난이도 */}
        <section
          className={`${styles["filter-sidebar__section"]} ${styles["filter-sidebar__section--level"]}`}
          aria-labelledby="filter-level-title"
        >
          <h3
            id="filter-level-title"
            className={styles["filter-sidebar__section-title"]}
          >
            난이도
          </h3>
          <ul
            className={`${styles["filter-sidebar__list"]} ${styles["filter-sidebar__list--level"]}`}
          >
            <li className={styles["filter-sidebar__item"]}>
              <label className={styles["filter-sidebar__checkbox"]}>
                <input
                  type="checkbox"
                  className={styles["filter-sidebar__checkbox-input"]}
                />
                <span className={styles["filter-sidebar__checkbox-label"]}>
                  입문
                </span>
              </label>
            </li>
            <li className={styles["filter-sidebar__item"]}>
              <label className={styles["filter-sidebar__checkbox"]}>
                <input
                  type="checkbox"
                  className={styles["filter-sidebar__checkbox-input"]}
                />
                <span className={styles["filter-sidebar__checkbox-label"]}>
                  중급
                </span>
              </label>
            </li>
            <li className={styles["filter-sidebar__item"]}>
              <label className={styles["filter-sidebar__checkbox"]}>
                <input
                  type="checkbox"
                  className={styles["filter-sidebar__checkbox-input"]}
                />
                <span className={styles["filter-sidebar__checkbox-label"]}>
                  고급
                </span>
              </label>
            </li>
          </ul>
        </section>
      </nav>

      {/* Mobile: Collapsible (접이식) — 동일 내용, details / summary로 구현 */}
      <details className={styles["filter-sidebar__mobile"]}>
        <summary
          className={styles["filter-sidebar__mobile-summary"]}
          aria-label="필터 열기"
        >
          필터
        </summary>
        <div className={styles["filter-sidebar__mobile-panel"]}>
          {/* 모바일 패널 안에 동일한 두 섹션을 재사용 마크업으로 중복 삽입 */}
          <div className={styles["filter-sidebar__mobile-content"]}>
            <section
              className={`${styles["filter-sidebar__section"]} ${styles["filter-sidebar__section--category"]}`}
              aria-label="카테고리"
            >
              <h3 className={styles["filter-sidebar__section-title"]}>
                카테고리
              </h3>
              {/* 간결 버전: 모바일에선 2뎁스까지만 예시 (원하면 3뎁스 동일 복제 가능) */}
              <ul
                className={`${styles["filter-sidebar__list"]} ${styles["filter-sidebar__list--level1"]}`}
              >
                <li className={styles["filter-sidebar__item"]}>
                  <a
                    href="/?cat=frontend"
                    className={styles["filter-sidebar__link"]}
                  >
                    프론트엔드
                  </a>
                </li>
                <li className={styles["filter-sidebar__item"]}>
                  <a
                    href="/?cat=backend"
                    className={styles["filter-sidebar__link"]}
                  >
                    백엔드
                  </a>
                </li>
              </ul>
            </section>

            <section
              className={`${styles["filter-sidebar__section"]} ${styles["filter-sidebar__section--level"]}`}
              aria-label="난이도"
            >
              <h3 className={styles["filter-sidebar__section-title"]}>
                난이도
              </h3>
              <ul
                className={`${styles["filter-sidebar__list"]} ${styles["filter-sidebar__list--level"]}`}
              >
                <li className={styles["filter-sidebar__item"]}>
                  <label className={styles["filter-sidebar__checkbox"]}>
                    <input
                      type="checkbox"
                      className={styles["filter-sidebar__checkbox-input"]}
                    />
                    <span className={styles["filter-sidebar__checkbox-label"]}>
                      입문
                    </span>
                  </label>
                </li>
                <li className={styles["filter-sidebar__item"]}>
                  <label className={styles["filter-sidebar__checkbox"]}>
                    <input
                      type="checkbox"
                      className={styles["filter-sidebar__checkbox-input"]}
                    />
                    <span className={styles["filter-sidebar__checkbox-label"]}>
                      중급
                    </span>
                  </label>
                </li>
                <li className={styles["filter-sidebar__item"]}>
                  <label className={styles["filter-sidebar__checkbox"]}>
                    <input
                      type="checkbox"
                      className={styles["filter-sidebar__checkbox-input"]}
                    />
                    <span className={styles["filter-sidebar__checkbox-label"]}>
                      고급
                    </span>
                  </label>
                </li>
              </ul>
            </section>

            <a
              href="#"
              className={styles["filter-sidebar__mobile-close"]}
              aria-label="필터 닫기"
            >
              닫기
            </a>
          </div>
        </div>
      </details>
    </>
  );
}
