'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';

export function RequireInstructor({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthState();
  const router = useRouter();
  const pathname = usePathname(); // 보호 경로

  useEffect(() => {
    if (loading) return;

    // 로그인 안 된 경우 → 홈에서 로그인 모달
    if (!user) {
      const params = new URLSearchParams();
      params.set('modal', 'login');
      params.set('redirect', pathname || '/');

      router.replace(`/?${params.toString()}`, { scroll: false });
      return;
    }

    const isInstructor = user.roles?.includes('INSTRUCTOR');

    // 강사 O → 통과
    if (isInstructor) return;

    // 강사 X → 마이페이지에서 강사 권한 모달 띄우기
    const params = new URLSearchParams();
    params.set('modal', 'roleRequest');
    params.set('redirect', pathname || '/');

    router.replace(`/mypage?${params.toString()}`, { scroll: false });
  }, [loading, user, router, pathname]);

  if (loading) return null;
  if (!user) return null;

  const isInstructor = user.roles?.includes('INSTRUCTOR');
  if (!isInstructor) return null;

  return <>{children}</>;
}
