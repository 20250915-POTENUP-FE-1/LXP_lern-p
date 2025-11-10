// guards/RequireAuth.jsx
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { Navigate, useLocation } from 'react-router';

export function RequireAuth({ children }) {
  const { user, loading } = useAuthState();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    // 로그인 모달을 "현재 페이지 위"에서 열고 싶으면: 같은 경로 + state
    return (
      <Navigate
        to={location.pathname}
        replace
        state={{ modal: 'login', redirect: location.pathname }}
      />
    );
  }

  return children;
}
