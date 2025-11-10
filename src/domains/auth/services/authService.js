import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { auth } from '@/shared/lib/firebase/auth';

/**
 * 회원가입
 */
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firebase Auth 계정 정보 설정
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

/**
 * 로그인
 */
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

/**
 * 로그아웃
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw error;
  }
};

/**
 * Auth 상태 subscribe (로그인/로그아웃 감지)
 */
export function subscribeAuthState(callback) {
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
export const deleteAccount = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('로그인 되어있지 않습니다.');
    }
    await deleteUser(auth.currentUser);
  } catch (error) {
    console.error('계정 삭제 실패:', error);
    throw error;
  }
};
