import React from "react";
import styles from "./CourseListPage.module.css";
import { FilterSidebar } from "@/domains/course/components/FilterSidebar";
import { SortSelect } from "@/domains/course/components/SortSelect";
import { CourseCard } from "@/domains/course/components/CourseCard";
import { SearchBar } from "../components/SearchBar";

export default function CourseListPage() {
  return (
    <main className={`${styles["catalog"]} container`} aria-label="강좌 목록">
      {/* 툴바 */}
      <div className={styles["catalog__toolbar"]}>
        <SearchBar />
        <SortSelect />
      </div>

      {/* 본문 2열 */}
      <div className={styles["catalog__grid"]}>
        {/* 사이드바 */}
        <aside className={styles["catalog__sidebar"]}>
          <FilterSidebar />
        </aside>

        {/* 콘텐츠 */}
        <section
          className={styles["catalog__content"]}
          aria-label="강좌 카드 목록"
        >
          <div
            className={`${styles["catalog__cards"]} ${styles["course-grid"]}`}
          >
            {/* 데모 카드 8개 */}
            {Array.from({ length: 8 }).map((_, i) => (
              <CourseCard key={i} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
