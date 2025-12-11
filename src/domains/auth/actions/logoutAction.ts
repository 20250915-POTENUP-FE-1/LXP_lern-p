'use server';

import { cookies } from 'next/headers';
import { logout } from '../services/authService';

export async function logoutAction() {
  try {
    await logout();
  } catch (e) {
    console.error('서버 로그아웃 실패:', e);
  }

  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}
