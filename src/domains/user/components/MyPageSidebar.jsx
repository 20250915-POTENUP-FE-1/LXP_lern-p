import { useAuthState } from "@/domains/auth/hooks/useAuthState";
import styles from '@/domains/user/components/MyPageSidebar.module.css';

import { NavLink } from 'react-router';

export function MyPageSidebar() {
  const { user } = useAuthState();
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
              <NavLink to="/mypage" end className={styles['mypage-nav__link']}>
                내 정보
              </NavLink>
            </li>
            <li className={styles['mypage-nav__item']}>
              <NavLink to="/mypage/enrolled" className={styles['mypage-nav__link']}>
                수강 중인 강좌
              </NavLink>
            </li>
            <li className={styles['mypage-nav__item']}>
              <NavLink to="/mypage/cart" className={styles['mypage-nav__link']}>
                장바구니
              </NavLink>
            </li>
          </ul>
        </div>

        {user?.roles?.includes("INSTRUCTOR") && (
        <div
          className={`${styles['mypage-nav__section']} ${styles['mypage-nav__section--instructor']}`}
          aria-label="강사 전용"
        >
          <h4 className={styles['mypage-nav__section-title']}>강사</h4>
          <ul className={styles['mypage-nav']}>
            <li className={styles['mypage-nav__item']}>
              <NavLink to="/mypage/instructor/courses" className={styles['mypage-nav__link']}>
                내가 등록한 강좌
              </NavLink>
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
                  <NavLink index="true" className={styles['mypage-nav__link']}>
                    내 정보
                  </NavLink>
                </li>
                <li className={styles['mypage-nav__item']}>
                  <NavLink to="/mypage/enrolled" className={styles['mypage-nav__link']}>
                    수강 중인 강좌
                  </NavLink>
                </li>
                <li className={styles['mypage-nav__item']}>
                  <NavLink to="/mypage/cart" className={styles['mypage-nav__link']}>
                    장바구니
                  </NavLink>
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
                  <NavLink to="/mypage/instructor/courses" className={styles['mypage-nav__link']}>
                    내가 등록한 강좌
                  </NavLink>
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
