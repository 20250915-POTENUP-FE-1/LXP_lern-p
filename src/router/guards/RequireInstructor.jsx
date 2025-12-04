import { Navigate, useLocation } from 'react-router';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';

export function RequireInstructor({ children }) {
  const { user, loading } = useAuthState();
  const location = useLocation();

  if (loading) return null;

  // 로그인 필요
  if (!user) {
    return (
      <Navigate
        to={location.pathname}
        replace
        state={{ modal: 'login', redirect: location.pathname }}
      />
    );
  }

  const isInstructor = user.roles?.includes('INSTRUCTOR');

  if (isInstructor) return children;

  // 보호된 instructor 섹션이면 → /mypage 로 이동시키고, 그곳에서 모달 열기
  if (location.pathname.startsWith('/mypage/instructor')) {
    return (
      <Navigate
        to="/mypage"
        replace
        state={{ modal: 'roleRequest', redirect: location.pathname }}
      />
    );
  }

  // 그 외는 홈에서 모달
  return <Navigate to="/" replace state={{ modal: 'roleRequest', redirect: location.pathname }} />;
}
