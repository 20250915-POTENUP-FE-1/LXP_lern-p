import React from "react";
import styles from "./FilterSidebar.module.css";

export function FilterSidebar() {
  return (
    <>
      <nav
        className={`${styles["sidebar"]} ${styles["sidebar--left"]} ${styles["sidebar--floating"]}`}
        aria-label="카테고리 및 난이도 필터"
      >
        <div className={styles["filter"]}>
          <h2 className={styles["filter__title"]}>필터</h2>

          <section
            className={`${styles["filter__section"]} ${styles["filter__section--category"]}`}
            aria-labelledby="filter-cat-title"
          >
            <h3
              id="filter-cat-title"
              className={styles["filter__section-title"]}
            >
              카테고리
            </h3>

            <ul
              className={`${styles["filter__list"]} ${styles["filter__list--depth1"]}`}
            >
              <li className={styles["filter__item"]}>
                <a href="/?cat=frontend" className={styles["filter__link"]}>
                  프론트엔드
                </a>
                <ul
                  className={`${styles["filter__list"]} ${styles["filter__list--depth2"]}`}
                >
                  <li className={styles["filter__item"]}>
                    <a
                      href="/?cat=frontend-react"
                      className={styles["filter__link"]}
                    >
                      React
                    </a>
                    <ul
                      className={`${styles["filter__list"]} ${styles["filter__list--depth3"]}`}
                    >
                      <li className={styles["filter__item"]}>
                        <a
                          href="/?cat=frontend-react-beginner"
                          className={styles["filter__link"]}
                          aria-current="page"
                        >
                          입문
                        </a>
                      </li>
                      <li className={styles["filter__item"]}>
                        <a
                          href="/?cat=frontend-react-intermediate"
                          className={styles["filter__link"]}
                        >
                          중급
                        </a>
                      </li>
                      <li className={styles["filter__item"]}>
                        <a
                          href="/?cat=frontend-react-advanced"
                          className={styles["filter__link"]}
                        >
                          고급
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className={styles["filter__item"]}>
                    <a
                      href="/?cat=frontend-vue"
                      className={styles["filter__link"]}
                    >
                      Vue
                    </a>
                    <ul
                      className={`${styles["filter__list"]} ${styles["filter__list--depth3"]}`}
                    >
                      <li className={styles["filter__item"]}>
                        <a
                          href="/?cat=frontend-vue-beginner"
                          className={styles["filter__link"]}
                        >
                          입문
                        </a>
                      </li>
                      <li className={styles["filter__item"]}>
                        <a
                          href="/?cat=frontend-vue-intermediate"
                          className={styles["filter__link"]}
                        >
                          중급
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li className={styles["filter__item"]}>
                <a href="/?cat=backend" className={styles["filter__link"]}>
                  백엔드
                </a>
                <ul
                  className={`${styles["filter__list"]} ${styles["filter__list--depth2"]}`}
                >
                  <li className={styles["filter__item"]}>
                    <a
                      href="/?cat=backend-spring"
                      className={styles["filter__link"]}
                    >
                      Spring
                    </a>
                    <ul
                      className={`${styles["filter__list"]} ${styles["filter__list--depth3"]}`}
                    >
                      <li className={styles["filter__item"]}>
                        <a
                          href="/?cat=backend-spring-beginner"
                          className={styles["filter__link"]}
                        >
                          입문
                        </a>
                      </li>
                      <li className={styles["filter__item"]}>
                        <a
                          href="/?cat=backend-spring-intermediate"
                          className={styles["filter__link"]}
                        >
                          중급
                        </a>
                      </li>
                      <li className={styles["filter__item"]}>
                        <a
                          href="/?cat=backend-spring-advanced"
                          className={styles["filter__link"]}
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

          <section
            className={`${styles["filter__section"]} ${styles["filter__section--level"]}`}
            aria-labelledby="filter-level-title"
          >
            <h3
              id="filter-level-title"
              className={styles["filter__section-title"]}
            >
              난이도
            </h3>
            <ul className={styles["filter__list"]}>
              <li className={styles["filter__item"]}>
                <label className={styles["filter__checkbox"]}>
                  <input
                    type="checkbox"
                    className={styles["filter__checkbox-input"]}
                  />
                  <span className={styles["filter__checkbox-label"]}>
                    입문
                  </span>
                </label>
              </li>
              <li className={styles["filter__item"]}>
                <label className={styles["filter__checkbox"]}>
                  <input
                    type="checkbox"
                    className={styles["filter__checkbox-input"]}
                  />
                  <span className={styles["filter__checkbox-label"]}>
                    중급
                  </span>
                </label>
              </li>
              <li className={styles["filter__item"]}>
                <label className={styles["filter__checkbox"]}>
                  <input
                    type="checkbox"
                    className={styles["filter__checkbox-input"]}
                  />
                  <span className={styles["filter__checkbox-label"]}>
                    고급
                  </span>
                </label>
              </li>
            </ul>
          </section>
        </div>
      </nav>

      <details className={`${styles["sidebar"]} ${styles["sidebar--collapsible"]}`}>
        <summary className={styles["sidebar__summary"]} aria-label="필터 열기">
          필터
        </summary>
        <div className={styles["sidebar__panel"]}>
          <div className={styles["filter"]}>
            <section
              className={`${styles["filter__section"]} ${styles["filter__section--category"]}`}
              aria-label="카테고리"
            >
              <h3 className={styles["filter__section-title"]}>카테고리</h3>
              <ul
                className={`${styles["filter__list"]} ${styles["filter__list--depth1"]}`}
              >
                <li className={styles["filter__item"]}>
                  <a href="/?cat=frontend" className={styles["filter__link"]}>
                    프론트엔드
                  </a>
                </li>
                <li className={styles["filter__item"]}>
                  <a href="/?cat=backend" className={styles["filter__link"]}>
                    백엔드
                  </a>
                </li>
              </ul>
            </section>

            <section
              className={`${styles["filter__section"]} ${styles["filter__section--level"]}`}
              aria-label="난이도"
            >
              <h3 className={styles["filter__section-title"]}>난이도</h3>
              <ul className={styles["filter__list"]}>
                <li className={styles["filter__item"]}>
                  <label className={styles["filter__checkbox"]}>
                    <input
                      type="checkbox"
                      className={styles["filter__checkbox-input"]}
                    />
                    <span className={styles["filter__checkbox-label"]}>
                      입문
                    </span>
                  </label>
                </li>
                <li className={styles["filter__item"]}>
                  <label className={styles["filter__checkbox"]}>
                    <input
                      type="checkbox"
                      className={styles["filter__checkbox-input"]}
                    />
                    <span className={styles["filter__checkbox-label"]}>
                      중급
                    </span>
                  </label>
                </li>
                <li className={styles["filter__item"]}>
                  <label className={styles["filter__checkbox"]}>
                    <input
                      type="checkbox"
                      className={styles["filter__checkbox-input"]}
                    />
                    <span className={styles["filter__checkbox-label"]}>
                      고급
                    </span>
                  </label>
                </li>
              </ul>
            </section>

            <a
              href="#"
              className={styles["sidebar__close"]}
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
