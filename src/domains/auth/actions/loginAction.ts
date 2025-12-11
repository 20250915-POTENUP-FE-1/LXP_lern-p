'use server';

import { cookies } from 'next/headers';
import { login } from '../services/authService';

export type LoginActionState = {
  error?: string;
  success: boolean;
};

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { success: false, error: '이메일과 비밀번호를 입력해주세요.' };
  }

  try {
    const data = await login({ email, password });

    const cookieStore = await cookies();
    cookieStore.set('accessToken', data.accessToken, {
      httpOnly: true,
      path: '/',
    });
    cookieStore.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    const msg = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
    return { success: false, error: msg };
  }
}
