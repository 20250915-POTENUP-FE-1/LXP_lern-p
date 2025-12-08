'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthState();
  const router = useRouter();
  const pathname = usePathname(); // 보호 경로

  useEffect(() => {
    if (loading) return;
    if (user) return; // 로그인 돼 있으면 통과

    // 비로그인 → 홈(/)으로 튕기면서 modal=login, redirect=원래경로
    const params = new URLSearchParams();
    params.set('modal', 'login');
    params.set('redirect', pathname || '/');

    router.replace(`/?${params.toString()}`, { scroll: false });
  }, [loading, user, router, pathname]);

  if (loading) return null;
  if (!user) return null; // 이미 / 로 튕기는 중이므로 내용은 안 그림

  return <>{children}</>;
}
