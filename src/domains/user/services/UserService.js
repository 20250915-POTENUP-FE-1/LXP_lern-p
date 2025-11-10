import { db } from '@/shared/lib/firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';

export const createUserProfile = async ({ id, email, name, avatarUrl = '' }) => {
  const now = new Date().toISOString();

  const userProfile = {
    id,
    email,
    name,
    roles: ['USER'],
    cart: [],
    enrolledCourses: [],
    createdCourses: [],
    avatarUrl,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, 'users', id), userProfile);

  return userProfile;
};
