import React from "react";
import { Outlet } from "react-router";
import layout from "@/domains/user/pages/MyPage.module.css";
import { MyPageSidebar } from "../components/MyPageSidebar";

export default function MyPage() {
  // 강사라면 layout["mypage--instructor"]를 클래스에 추가 (지금은 마크업만)
  return (
    <section
      className={`${layout["mypage"]} container`}
      aria-label="마이페이지"
    >
      <div className={layout["mypage__layout"]}>
        <aside className={layout["mypage__sidebar"]}>
          <MyPageSidebar />
        </aside>
        <div className={layout["mypage__content"]}>
          <Outlet />
        </div>
      </div>
    </section>
  );
}
