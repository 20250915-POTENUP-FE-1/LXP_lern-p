'use client'

import Link from "next/link";
import styles from '@/domains/user/components/MyPageSidebar.module.css';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { usePathname } from "next/navigation";

export default function MyPageSidebar() {
  const { user } = useAuthState(); // 클라이언트 훅 필요 시 -> 분리
  const pathname = usePathname();

  // 🟨 ⭐ 임시 로그인 user 주입 (나중에 이 한 줄만 지우면 끝!)
  const mockUser = { id: "u123", name: "김오리", email: "duck@example.com", roles: "INSTRUCTOR", createdAt: "2025-01-01" };
  const _user = user ?? mockUser; // ← 지울 줄: 이 한 줄만 삭제하면 기존 구조 그대로

  const isActive = (path: string) =>
    pathname === path ? styles["active"] : "";

  return (
    <>
      <nav
        className={`${styles['sidebar']} ${styles['sidebar--left']} ${styles['sidebar--floating']}`}
        aria-label="마이페이지 탐색"
      >
        <div className={styles['mypage-nav__section']}>
          <h4 className={styles['mypage-nav__section-title']}>내 계정</h4>
          <ul className={styles['mypage-nav']}>
            <li className={styles['mypage-nav__item']}>
              <Link href="/mypage" className={`${styles["mypage-nav__link"]} ${isActive("/mypage")}`}>
                내 정보
              </Link>
            </li>

            <li className={styles['mypage-nav__item']}>
              <Link href="/mypage/enrolled" className={`${styles["mypage-nav__link"]} ${isActive("/mypage/enrolled")}`}>
                수강 중인 강좌
              </Link>
            </li>

            <li className={styles['mypage-nav__item']}>
              <Link href="/mypage/cart" className={`${styles["mypage-nav__link"]} ${isActive("/mypage/cart")}`}>
                장바구니
              </Link>
            </li>
          </ul>
        </div>

        {_user?.roles?.includes('INSTRUCTOR') && (
        <div
          className={`${styles['mypage-nav__section']} ${styles['mypage-nav__section--instructor']}`}
          aria-label="강사 전용"
        >
          <h4 className={styles['mypage-nav__section-title']}>강사</h4>
          <ul className={styles['mypage-nav']}>
            <li className={styles['mypage-nav__item']}>
              <Link
                href="/mypage/instructor/courses"
                className={styles['mypage-nav__link']}
              >
                내가 등록한 강좌
              </Link>
            </li>
          </ul>
        </div>
         )}
      </nav>
     

      <details className={`${styles['sidebar']} ${styles['sidebar--collapsible']}`}>
        <summary className={styles['sidebar__summary']}>마이페이지 메뉴</summary>
        <div className={styles['sidebar__panel']}>
          <nav aria-label="마이페이지 탐색 (모바일)">
            <div className={styles['mypage-nav__section']}>
              <h4 className={styles['mypage-nav__section-title']}>내 계정</h4>
              <ul className={styles['mypage-nav']}>
                <li className={styles['mypage-nav__item']}>
                  <Link href="/mypage" className={styles['mypage-nav__link']}>
                    내 정보
                  </Link>
                </li>

                <li className={styles['mypage-nav__item']}>
                  <Link href="/mypage/enrolled" className={styles['mypage-nav__link']}>
                    수강 중인 강좌
                  </Link>
                </li>

                <li className={styles['mypage-nav__item']}>
                  <Link href="/mypage/cart" className={styles['mypage-nav__link']}>
                    장바구니
                  </Link>
                </li>
              </ul>
            </div>

            <div
              className={`${styles['mypage-nav__section']} ${styles['mypage-nav__section--instructor']}`}
              aria-label="강사 전용"
            >
              <h4 className={styles['mypage-nav__section-title']}>강사</h4>
              <ul className={styles['mypage-nav']}>
                <li className={styles['mypage-nav__item']}>
                  <Link
                    href="/mypage/instructor/courses"
                    className={styles['mypage-nav__link']}
                  >
                    내가 등록한 강좌
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <a href="#main-content" className={styles['sidebar__close']}>
            닫기
          </a>
        </div>
      </details>
    </>
  );
}
