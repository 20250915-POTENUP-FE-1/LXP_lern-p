import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";

import { auth } from "@/shared/lib/firebase/auth";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

/**
 * 회원가입
 */
export const signUp = async (
  email: string,
  password: string,
  displayName?: string
): Promise<AuthUser> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (displayName) {
      await updateProfile(user, { displayName });
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? displayName ?? null,
      photoURL: user.photoURL ?? null,
    };
  } catch (error) {
    console.error("회원가입 실패:", error);
    throw error;
  }
};

/**
 * 로그인
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
    };
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw error;
  }
};

/**
 * Auth 상태 subscribe (로그인/로그아웃 감지)
 */
export function subscribeAuthState(
  callback: (user: AuthUser | null) => void
): () => void {
  return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
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
  try {
    if (!auth.currentUser) {
      throw new Error("로그인 되어있지 않습니다.");
    }
    await deleteUser(auth.currentUser);
  } catch (error) {
    console.error("계정 삭제 실패:", error);
    throw error;
  }
};
