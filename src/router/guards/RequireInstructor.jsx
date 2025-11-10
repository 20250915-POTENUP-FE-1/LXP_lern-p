import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { Navigate, useLocation } from 'react-router';

export function RequireInstructor({ children }) {
  const { user, loading } = useAuthState();
  const location = useLocation();

  if (loading) return null;

  // 로그인 필요
  if (!user) {
    return <Navigate to={`/?login=1&redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 강사 권한 필요
  if (!user.roles?.includes('INSTRUCTOR')) {
    return (
      <Navigate to={`/?roleRequest=1&redirect=${encodeURIComponent(location.pathname)}`} replace />
    );
  }

  return children;
}
