import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase/firestore';
import type { User, UserResponse } from '@/domains/user/types/user';

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

export type CreateUserProfileRequest = {
  id: string;
  email: string | null;
  name: string;
  avatarUrl?: string | null;
};

const toDateOrNow = (
  value: Timestamp | ReturnType<typeof serverTimestamp> | null | undefined,
): Date => {
  if (value instanceof Timestamp) return value.toDate();
  return new Date();
};

export const createUserProfile = async ({
  id,
  email,
  name,
  avatarUrl = '',
}: CreateUserProfileRequest): Promise<void> => {
  const userProfile: FirestoreUserDoc = {
    id,
    email,
    name,
    roles: ['USER'],
    cart: [],
    enrolledCourses: [],
    createdCourses: [],
    avatarUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', id), userProfile);
};

export const getUserProfile = async (uid: string): Promise<UserResponse> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;

    const data = snap.data() as FirestoreUserDoc;

    const user: User = {
      id: data.id,
      email: data.email ?? '',
      name: data.name,
      roles: data.roles ?? ['USER'],
      cart: data.cart ?? [],
      enrolledCourses: data.enrolledCourses ?? [],
      createdCourses: data.createdCourses ?? [],
      avatarUrl: data.avatarUrl ?? undefined,
      createdAt: toDateOrNow(data.createdAt),
      updatedAt: toDateOrNow(data.updatedAt),
    };

    return user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserToInstructor = async (uid: string): Promise<void> => {
  const ref = doc(db, 'users', uid);

  await updateDoc(ref, {
    roles: arrayUnion('INSTRUCTOR'),
    updatedAt: serverTimestamp(),
  });
};
