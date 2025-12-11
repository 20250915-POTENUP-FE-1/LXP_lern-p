'use client';

import { create } from 'zustand';
import type { User } from '@/domains/user/types/user';

// 1) 실제 유저 데이터
type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

// 2) 유저 프로필 로딩 상태 ( /api/users/me 호출 상태 )
type AuthState = {
  isUserProfileLoaded: boolean; // 한번이라도 /me 호출 완료했는지
  isUserProfileLoading: boolean; // 지금 /me 호출 중인지
  setIsUserProfileLoaded: (v: boolean) => void;
  setIsUserProfileLoading: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isUserProfileLoaded: false,
  isUserProfileLoading: false,
  setIsUserProfileLoaded: (v) => set({ isUserProfileLoaded: v }),
  setIsUserProfileLoading: (v) => set({ isUserProfileLoading: v }),
}));
