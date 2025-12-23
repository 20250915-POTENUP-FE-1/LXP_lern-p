'use client';

import { useEffect } from 'react';
import { useAuthStore, useUserStore } from '@/domains/auth/store/useAuthStore';
import type { User } from '@/domains/user/types/user';

type AuthProviderProps = {
  initialUser: User | null;
  children: React.ReactNode;
};

const DEV_FAKE_USER: User = {
  id: 'DEV_USER_ID',
  email: 'dev-instructor@test.com',
  nickname: '개발용강사',
  roles: ['INSTRUCTOR'],
  cart: [],
  enrolledCourses: [],
  createdCourses: [],
  avatarUrl: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const setUser = useUserStore((s) => s.setUser);
  const resetUser = useUserStore((s) => s.clearUser);
  const setIsLoaded = useAuthStore((s) => s.setIsUserProfileLoaded);
  const setIsLoading = useAuthStore((s) => s.setIsUserProfileLoading);

  useEffect(() => {
    // 서버에서 받은 initialUser를 zustand에 싱크
    setIsLoading(true);

    const isDev = process.env.NODE_ENV === 'development';

    if (initialUser) {
      setUser(initialUser);
    } else if (isDev) {
      setUser(DEV_FAKE_USER);
    } else {
      resetUser();
    }

    setIsLoaded(true);
    setIsLoading(false);
  }, [initialUser, setUser, resetUser, setIsLoaded, setIsLoading]);

  return <>{children}</>;
}
