'use server';

import { cookies } from 'next/headers';
import { validateSignUp } from '@/domains/auth/utils/validateSignUp';
import type { SignUpForm } from '@/domains/auth/types/auth';
import { signUp } from '@/domains/auth/services/authService';

export type SignUpActionState = {
  error?: string;
  success: boolean;
};

export async function signUpAction(
  _prevState: SignUpActionState,
  formData: FormData,
): Promise<SignUpActionState> {
  const name = String(formData.get('name') ?? '');
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const passwordConfirm = String(formData.get('passwordConfirm') ?? '');

  const input: SignUpForm = {
    name,
    email,
    password,
    passwordConfirm,
  };

  // 서버에서 한 번 더 validation
  const errorMsg = validateSignUp(input);
  if (errorMsg) {
    return { error: errorMsg, success: false };
  }

  try {
    // 서버에 회원가입 요청
    const data = await signUp({
      nickname: name,
      email,
      password,
    });

    const cookieStore = await cookies();
    cookieStore.set('accessToken', data.accessToken, {
      httpOnly: true,
      path: '/',
    });
    cookieStore.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      path: '/',
    });

    // 성공적으로 가입 시, 성공 상태 반환
    return { success: true };
  } catch (error: unknown) {
    // 서버에서 반환된 에러 메시지 처리
    const err = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.';
    return { error: err, success: false };
  }
}
