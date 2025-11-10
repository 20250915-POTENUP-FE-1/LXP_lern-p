import { subscribeAuthState } from '@/domains/auth/services/authService';
import { createUserProfile, getUserProfile } from '@/domains/user/services/UserService';
import { useEffect, useState } from 'react';

export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (authUser) => {
      try {
        // 로그아웃 상태
        if (!authUser) {
          setUser(null);
          setInitialized(true);
          return;
        }

        // Firestore 유저 문서 읽기
        let userDoc = await getUserProfile(authUser.uid);

        // Firestore 문서가 없으면 새로 생성 (최초 회원)
        if (!userDoc) {
          userDoc = await createUserProfile(authUser); // 네가 만든 함수 그대로 사용
        }

        // Timestamp 안전 변환 (없으면 null)
        const createdAt =
          userDoc.createdAt?.toDate?.().toISOString?.() ?? userDoc.createdAt ?? null;
        const updatedAt =
          userDoc.updatedAt?.toDate?.().toISOString?.() ?? userDoc.updatedAt ?? null;

        // 최종 user 객체
        setUser({
          id: userDoc.id,
          email: authUser.email,
          name: userDoc.name ?? authUser.displayName ?? '',
          roles: userDoc.roles ?? ['USER'],
          cart: userDoc.cart ?? [],
          enrolledCourseIds: userDoc.enrolledCourseIds ?? [],
          createdCourses: userDoc.createdCourses ?? [],
          avatarUrl: userDoc.avatarUrl ?? authUser.photoURL ?? null,
          createdAt,
          updatedAt,
        });
      } catch (error) {
        console.error('useAuthState 오류', error);
        setUser(null);
      } finally {
        setInitialized(true);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading: !initialized, initialized };
};
