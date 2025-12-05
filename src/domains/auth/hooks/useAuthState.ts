import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { subscribeAuthState } from '@/domains/auth/services/authService';
import { createUserProfile } from '@/domains/user/services/userService';
import { db } from '@/shared/lib/firebase/firestore';
import type { User } from '@/domains/user/types/user';
import type { User as FirebaseUser } from "firebase/auth";

export type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
};

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribeAuth = subscribeAuthState(async (authUser: FirebaseUser | null) => {
      if (!authUser) {
        setUser(null);
        setInitialized(true);
        if (unsubscribeUserDoc) unsubscribeUserDoc();
        return;
      }

      const ref = doc(db, 'users', authUser.uid);
      let userDocSnap = await getDoc(ref);

      if (!userDocSnap.exists()) {
        await createUserProfile(authUser);
        userDocSnap = await getDoc(ref);
      }

      if (unsubscribeUserDoc) unsubscribeUserDoc();

      unsubscribeUserDoc = onSnapshot(ref, (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();

        setUser({
          id: authUser.uid,
          email: authUser.email ?? '',
          name: data.name ?? authUser.displayName ?? '',
          roles: data.roles ?? ['USER'],
          cart: data.cart ?? [],
          enrolledCourses: data.enrolledCourses ?? [],
          createdCourses: data.createdCourses ?? [],
          avatarUrl: data.avatarUrl ?? authUser.photoURL ?? null,
          createdAt: data.createdAt?.toDate?.().toISOString?.() ?? data.createdAt ?? null,
          updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? data.updatedAt ?? null,
        });

        setInitialized(true);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  return { user, loading: !initialized, initialized };
};
