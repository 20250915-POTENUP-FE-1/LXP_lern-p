'use client';

import {
  doc,
  getDoc,
  onSnapshot,
  type Unsubscribe as FirestoreUnsubscribe,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/shared/lib/firebase/firestore';
import type { User } from '@/domains/user/types/user';
import { createUserProfile } from '@/domains/user/services/userService';
import { AuthUserResponse, subscribeAuthState } from '@/domains/auth/services/authService';

type UseAuthStateReturn = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
};

type FirestoreUserDoc = {
  id: string;
  email: string | null;
  name: string;
  roles?: User['roles'];
  cart?: User['cart'];
  enrolledCourses?: User['enrolledCourses'];
  createdCourses?: User['createdCourses'];
  avatarUrl?: string | null;
  createdAt?: Timestamp | ReturnType<typeof serverTimestamp> | null;
  updatedAt?: Timestamp | ReturnType<typeof serverTimestamp> | null;
};

const toDateOrNow = (
  value: Timestamp | ReturnType<typeof serverTimestamp> | null | undefined,
): Date => {
  if (value instanceof Timestamp) return value.toDate();
  return new Date();
};

export const useAuthState = (): UseAuthStateReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let unsubscribeUserDoc: FirestoreUnsubscribe | null = null;

    const unsubscribeAuth = subscribeAuthState((authUser: AuthUserResponse | null) => {
      void (async () => {
        if (!authUser) {
          setUser(null);
          setInitialized(true);
          if (unsubscribeUserDoc) unsubscribeUserDoc();
          return;
        }

        const ref = doc(db, 'users', authUser.uid);
        let userDocSnap = await getDoc(ref);

        if (!userDocSnap.exists()) {
          await createUserProfile({
            id: authUser.uid,
            email: authUser.email,
            name: authUser.displayName ?? '',
            avatarUrl: authUser.photoURL ?? null,
          });
          userDocSnap = await getDoc(ref);
        }

        if (unsubscribeUserDoc) unsubscribeUserDoc();

        unsubscribeUserDoc = onSnapshot(ref, (snap) => {
          if (!snap.exists()) return;

          const data = snap.data() as FirestoreUserDoc;

          setUser({
            id: authUser.uid,
            email: authUser.email ?? '',
            name: data.name ?? authUser.displayName ?? '',
            roles: data.roles ?? ['USER'],
            cart: data.cart ?? [],
            enrolledCourses: data.enrolledCourses ?? [],
            createdCourses: data.createdCourses ?? [],
            avatarUrl: data.avatarUrl ?? authUser.photoURL ?? undefined,
            createdAt: toDateOrNow(data.createdAt),
            updatedAt: toDateOrNow(data.updatedAt),
          });

          setInitialized(true);
        });
      })();
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  return { user, loading: !initialized, initialized };
};
