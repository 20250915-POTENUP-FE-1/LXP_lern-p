import { db } from '@/shared/lib/firebase/firestore';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

export const createUserProfile = async ({ id, email, name, avatarUrl = '' }) => {
  const userProfile = {
    id,
    email,
    name,
    roles: ['USER'],
    cart: [],
    enrolledCourseIds: [],
    createdCourses: [],
    avatarUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', id), userProfile);

  return userProfile;
};
