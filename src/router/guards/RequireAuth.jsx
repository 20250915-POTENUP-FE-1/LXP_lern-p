import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { Navigate, useLocation } from 'react-router';

export function RequireAuth({ children }) {
  const { user, loading } = useAuthState();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to={`/?login=1&redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
