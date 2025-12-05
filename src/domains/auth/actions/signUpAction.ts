'use server';

import type { FirebaseError } from 'firebase/app';
import { validateSignUp } from '@/domains/auth/utils/validateSignUp';
import type { SignUpForm } from '@/domains/auth/types/auth';
import { signUp } from '@/domains/auth/services/authService';
import { createUserProfile } from '@/domains/user/services/userService';

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

  // 1) 서버에서 한 번 더 validation
  const errorMsg = validateSignUp(input);
  if (errorMsg) {
    return { error: errorMsg, success: false };
  }

  try {
    // 2) Firebase Auth 회원가입
    const authUser = await signUp({
      email,
      password,
      displayName: name,
    });

    // 3) Firestore user document 생성
    await createUserProfile({
      id: authUser.uid,
      email: authUser.email,
      name: authUser.displayName ?? name,
      avatarUrl: authUser.photoURL ?? null,
    });

    // 여기서는 성공 플래그만 넘김 (redirect 안 함)
    return { success: true };
  } catch (error: unknown) {
    const err = error as FirebaseError & { code?: string };

    const message =
      (
        {
          'auth/invalid-email': '올바른 이메일 형식이 아닙니다.',
          'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
          'auth/weak-password': '비밀번호가 너무 약합니다.',
        } as Record<string, string>
      )[err.code ?? ''] ?? '회원가입 중 오류가 발생했습니다.';

    return { error: message, success: false };
  }
}
