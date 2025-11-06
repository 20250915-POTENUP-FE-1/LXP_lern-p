import React from "react";
import styles from "./SortSelect.module.css";

export function SortSelect() {
  return (
    <div
      className={`${styles["sort"]} ${styles["sort--compact"]}`}
      role="group"
      aria-label="정렬"
    >
      <select
        id="course-sort"
        className={styles["sort__select"]}
        aria-label="정렬 기준 선택"
      >
        <option>추천순</option>
        <option>신규순</option>
        <option>평점순</option>
        <option>가격 낮은순</option>
        <option>가격 높은순</option>
      </select>
    </div>
  );
}
