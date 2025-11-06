import React from "react";
import styles from "./FloatingCTA.module.css";

export function FloatingCTA() {
  return (
    <aside className={styles["floating-cta"]} aria-label="강좌 구매 패널">
      <div className={styles["floating-cta__panel"]}>
        <div className={styles["floating-cta__price"]}>
          <strong className={styles["floating-cta__price-value"]}>
            ₩49,000
          </strong>
          <span className={styles["floating-cta__price-note"]}>일시 결제</span>
        </div>
        <button className={styles["floating-cta__button"]}>수강 신청</button>
        <a className={styles["floating-cta__secondary"]} href="#curriculum">
          커리큘럼 보기
        </a>
      </div>
    </aside>
  );
}
