import React from "react";
import { Outlet } from "react-router";
import styles from "./Layouts.module.css";

export default function AuthLayout() {
  return (
    <div className={styles["auth-shell"]}>
      <header
        className={styles["auth-shell__header"]}
        role="banner"
        aria-label="인증 헤더"
      >
        <a href="/" className={styles["auth-shell__brand"]}>
          lernP
        </a>
      </header>
      <main
        id="main-content"
        className={styles["auth-shell__main"]}
        role="main"
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <footer className={styles["auth-shell__footer"]} role="contentinfo">
        <p className={styles["footer__text"]}>
          도움이 필요하신가요? support@lernp.example
        </p>
      </footer>
    </div>
  );
}
