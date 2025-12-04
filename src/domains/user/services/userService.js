import { arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase/firestore';

export const createUserProfile = async ({ id, email, name, avatarUrl = '' }) => {
  const userProfile = {
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

  return userProfile;
};

export const getUserProfile = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserToInstructor = async (uid) => {
  const ref = doc(db, 'users', uid);

  await updateDoc(ref, {
    roles: arrayUnion('INSTRUCTOR'),
    updatedAt: serverTimestamp(),
  });
};
