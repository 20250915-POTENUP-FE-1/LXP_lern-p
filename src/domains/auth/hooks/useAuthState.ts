'use client';

import { useAuthStore, useUserStore } from '@/domains/auth/store/useAuthStore';
// TODO : 임시 목업 데이터
import { MOCK_USER } from '@/mocks/user.mock';

export const useAuthState = () => {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  const isLoaded = useAuthStore((s) => s.isUserProfileLoaded);
  const isLoading = useAuthStore((s) => s.isUserProfileLoading);

  return {
    // TODO : 임시 목업 데이터
    user,
    setUser,
    clearUser,
    loading: !isLoaded || isLoading,
    initialized: isLoaded,
  };
};
