import { db } from '@/shared/lib/firebase/firestore';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

/**
 * 모든 강좌 목록을 불러옵니다.
 * @returns {Promise<Array>} 강좌 리스트
 */
export const getAllCourses = async () => {
  const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
