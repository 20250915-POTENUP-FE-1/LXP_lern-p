import { db } from '@/shared/lib/firebase/firestore';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

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

// 수정 예정
export const getUserProfile = async (uid) => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
