'use client';

import { ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { RoleRequestModal } from '@/domains/user/components/RoleRequestModal';
import { useModal } from '@/shared/hooks/useModal';
import { LoginModal } from '@/domains/auth/components/LoginModal';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { logoutAction } from '@/domains/auth/actions/logoutAction';
import { useCourseCreateEntry } from '@/domains/course/hooks/useCourseCreateEntry';
import styles from './Header.module.css';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { startCreateCourse } = useCourseCreateEntry();

  const { user, loading, clearUser } = useAuthState();
  const [menuOpen, setMenuOpen] = useState(false);

  const loginModal = useModal(false);
  const roleModal = useModal(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 → 드롭다운 닫기
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // URL query 로부터 모달 강제 오픈 (Next.js에서 state 기반 모달 대체)
  useEffect(() => {
    const modal = searchParams.get('modal');
    if (!modal) return;

    if (modal === 'login') loginModal.open();
    if (modal === 'roleRequest' && user) roleModal.open();

    // 모달 열고 나면 URL 정리
    router.replace(pathname);
  }, [searchParams, user, router, pathname, loginModal, roleModal]);

  const isInstructor = user?.roles?.includes('INSTRUCTOR');
  const instructorAction = (() => {
    if (!user) return null;
    console.log('instructorApplicationStatus:', user.instructorApplicationStatus);

    switch (user.instructorApplicationStatus) {
      case 'NOT_APPLIED':
        return {
          label: '강사 신청하기',
          onClick: roleModal.open,
          disabled: false,
        };
      case 'PENDING':
        return {
          label: '강사 승인 요청 중',
          onClick: undefined,
          disabled: true,
        };
      case 'REJECTED':
        return {
          label: '승인 거절됨',
          onClick: roleModal.open,
          disabled: false,
        };
      case 'APPROVED':
        if (isInstructor) {
          return {
            label: '강좌 등록하기',
            onClick: startCreateCourse,
            disabled: false,
          };
        }
        return {
          label: '강사 승인됨',
          onClick: undefined,
          disabled: true,
        };
      default:
        return null;
    }
  })();

  const handleLogout = async () => {
    setMenuOpen(false);

    await logoutAction();

    clearUser();
    // 홈으로 이동 + 상태 갱신
    router.push('/');
    router.refresh();
  };

  if (loading) return null;

  return (
    <>
      <header className={styles['header']} role="banner">
        <div className={styles['header__inner']}>
          {/* 왼쪽: 로고 */}
          <div className={styles['header__left']}>
            <Link href="/" className={styles['header__logo']} aria-label="홈으로 이동">
              <span className={styles['header__logo-text']}>
                <Image src={`/lernix_logo.svg`} width={`80`} height={`18`} alt={`Lernix`} />
              </span>
            </Link>
          </div>

          <div className={styles['header__center']} aria-hidden="true" />

          {/* 오른쪽: 액션 */}
          <div className={styles['header__right']}>
            <nav className={styles['header__actions']} aria-label="사용자 작업">
              <Link
                href="/cart"
                className={`${styles['header__action']} ${styles['header__action--icon']}`}
                aria-label="장바구니"
              >
                <ShoppingCart className={styles['header__icon']} aria-hidden="true" />
              </Link>
              {!user && (
                <button
                  type="button"
                  className={`${styles['header__action']} ${styles['header__action--link']}`}
                  onClick={loginModal.open}
                >
                  로그인
                </button>
              )}

              {instructorAction && (
                <button
                  type="button"
                  className={`${styles['header__action']} ${styles['header__action--cta']}`}
                  onClick={instructorAction.onClick}
                  disabled={instructorAction.disabled}
                >
                  {instructorAction.label}
                </button>
              )}
            </nav>

            {/* 프로필 */}
            {user && (
              <div ref={dropdownRef} className={styles['header__profile-wrapper']}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className={styles['header__profile']}
                >
                  <User className={styles['header__profile-icon']} />
                </button>

                {menuOpen && (
                  <ul className={styles['header__dropdown']} role="menu">
                    <li role="menuitem">
                      <Link
                        href="/mypage"
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

      {/* 모달들 */}
      <LoginModal isOpen={loginModal.isOpen} onClose={loginModal.close} />
      <RoleRequestModal isOpen={roleModal.isOpen} onClose={roleModal.close} user={user} />
    </>
  );
}
