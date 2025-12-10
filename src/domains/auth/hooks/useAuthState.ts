'use client';

import { useAuthStore, useUserStore } from '@/domains/auth/store/useAuthStore';

export const useAuthState = () => {
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  const isLoaded = useAuthStore((s) => s.isUserProfileLoaded);
  const isLoading = useAuthStore((s) => s.isUserProfileLoading);

  return {
    user,
    setUser,
    clearUser,
    loading: !isLoaded || isLoading,
    initialized: isLoaded,
  };
};
