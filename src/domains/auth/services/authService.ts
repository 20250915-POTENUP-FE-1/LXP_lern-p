import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Unsubscribe,
} from 'firebase/auth';
import { auth } from '@/shared/lib/firebase/auth';
import type { SignUpRequest, LoginRequest } from '../types/auth';

/** Firebase Auth 기준으로 우리가 사용하는 유저 응답 타입 (Response) */
export type AuthUserResponse = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

/**
 * 회원가입
 */
export const signUp = async ({
  email,
  password,
  displayName,
}: SignUpRequest): Promise<AuthUserResponse> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: displayName ?? user.displayName ?? null,
    photoURL: user.photoURL,
  };
};
/**
 * 로그인
 */
export const login = async ({ email, password }: LoginRequest): Promise<AuthUserResponse> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};
/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Auth 상태 subscribe
 */
export function subscribeAuthState(callback: (user: AuthUserResponse | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      callback(null);
      return;
    }
    callback({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  });
}
/**
 * 계정 삭제
 */
export const deleteAccount = async (): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('로그인 되어있지 않습니다.');
  }
  await deleteUser(auth.currentUser);
};
