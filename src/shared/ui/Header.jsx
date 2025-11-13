import { LoginModal } from '@/domains/auth/components/LoginModal';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { logout } from '@/domains/auth/services/authService';
import { RoleRequestModal } from '@/domains/user/components/RoleRequestModal';
import { useModal } from '@/shared/hooks/useModal';
import { User } from "lucide-react";
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import styles from './Header.module.css';

export function Header() {
  const { user, loading } = useAuthState();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loginModal = useModal(false);
  const roleModal = useModal(false);

  const dropdownRef = useRef(null);
  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Guard가 넘긴 location.state로 모달 오픈
  useEffect(() => {
    const s = location.state;
    if (!s) return;

    if (s.modal === 'login') loginModal.open();
    if (s.modal === 'roleRequest' && user) roleModal.open(); // 권한 요청은 로그인 상태에서만

    // 한 번 열고 나면 state 제거하여 루프/잔여상태 방지
    if (s.modal) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, user, navigate, location.pathname, loginModal, roleModal]);

  const closeLogin = () => loginModal.close();
  const closeRoleRequest = () => roleModal.close();

  const isInstructor = user?.roles?.includes('INSTRUCTOR');

  const handleLogout = async () => {
    setMenuOpen(false);
    // 먼저 홈으로 네비게이트(쿼리/스테이트 초기화) → 그 다음 실제 로그아웃
    navigate('/', { replace: true, state: null });
    await logout();
  };

  if (loading) return null;

  return (
    <>
      <header className={styles['header']} role="banner" aria-label="상단 내비게이션">
        <div className={styles['header__inner']}>
          {/* 좌측: 로고 */}
          <div className={styles['header__left']}>
            <Link to="/" className={styles['header__logo']} aria-label="홈으로 이동">
              <span className={styles['header__logo-text']}>LernP</span>
            </Link>
          </div>

          {/* 가운데 비움 */}
          <div className={styles['header__center']} aria-hidden="true" />

          {/* 우측: 액션 + 프로필 */}
          <div className={styles['header__right']}>
            {/* 버튼 영역 */}
            <nav className={styles['header__actions']} aria-label="사용자 작업">
              {/* 1) 게스트일 때 → 로그인 버튼 */}
              {!user && (
                <button
                  type="button"
                  className={`${styles['header__action']} ${styles['header__action--link']}`}
                  onClick={loginModal.open}
                >
                  로그인
                </button>
              )}

              {/* 2) 로그인했지만 강사 아님 → 강사 권한 요청 버튼 */}
              {user && !isInstructor && (
                <button
                  type="button"
                  className={`${styles['header__action']} ${styles['header__action--cta']}`}
                  onClick={roleModal.open}
                >
                  강사 권한 요청
                </button>
              )}

              {/* 3) 로그인 + 강사 권한 O → 강좌 등록 */}
              {user && isInstructor && (
                <Link
                  to="/courses/create"
                  className={`${styles['header__action']} ${styles['header__action--cta']}`}
                >
                  강좌 등록하기
                </Link>
              )}
            </nav>

            {/* 4) 프로필 아바타 + 드롭다운 */}
            {user && (
              <div ref={dropdownRef} className={styles['header__profile-wrapper']}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className={styles['header__profile']}
                >
                  {/* <span className={styles['header__avatar']}>
                    {user.displayName?.[0]?.toUpperCase() ?? 'U'}
                  </span> */}
                  <User className={styles['header__profile-icon']} />
                </button>

                {menuOpen && (
                  <ul className={styles['header__dropdown']} role="menu">
                    <li role="menuitem">
                      <Link
                        to="/mypage"
                        className={styles['header__dropdown-item']}
                        onClick={() => setMenuOpen(false)}
                      >
                        마이페이지
                      </Link>
                    </li>

                    <li role="menuitem">
                      <button
                        type="button"
                        className={styles['header__dropdown-item']}
                        onClick={handleLogout}
                      >
                        로그아웃
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <LoginModal isOpen={loginModal.isOpen} onClose={closeLogin} />
      <RoleRequestModal isOpen={roleModal.isOpen} onClose={closeRoleRequest} user={user} />
    </>
  );
}
