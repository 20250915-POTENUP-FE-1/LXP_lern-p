import { db } from '@/shared/lib/firebase/firestore';
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';

const cartsCol = collection(db, 'carts');
const cartDocId = (userId, courseId) => `${userId}_${courseId}`;

/** 해당 코스가 장바구닝에 있는지 */

export async function getCartStatus(userId, courseId) {
  const ref = doc(db, 'carts', cartDocId(userId, courseId));
  const snap = await getDoc(ref);
  return snap.exists();
}

/** 장바구니 추가 */
export async function addToCart(userId, courseId) {
  const ref = doc(db, 'carts', cartDocId(userId, courseId));

  const snap = await getDoc(ref);
  if (snap.exists()) return;

  await setDoc(ref, {
    id: cartDocId(userId, courseId),
    userId,
    courseId,
    addedAt: serverTimestamp(),
  });
}

/** 사용자의 장바구니 전체 조회 */

export async function getCartItemsByUser(userId) {
  const q = query(cartsCol, where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}
