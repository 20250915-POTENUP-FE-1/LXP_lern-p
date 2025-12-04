import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import type { User } from "@/domains/user/types/user";

/**
 * Firebase 인증 사용자 기반으로 Firestore 프로필 문서 생성
 * 첫 로그인 시에만 호출됨
 */
export const createUserProfile = async (
  authUser: FirebaseUser
): Promise<User> => {
  const userProfile: User = {
    id: authUser.uid,
    email: authUser.email ?? "",
    name: authUser.displayName ?? "",
    roles: ["USER"],
    cart: [],
    enrolledCourses: [],
    createdCourses: [],
    avatarUrl: authUser.photoURL ?? null,
    createdAt: null, // Firestore에선 timestamp, 상태 훅에서 문자열 변환됨
    updatedAt: null,
  };

  // Firestore에는 실제 timestamp로 저장
  await setDoc(doc(db, "users", authUser.uid), {
    ...userProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return userProfile;
};
