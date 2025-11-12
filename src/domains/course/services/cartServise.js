import { collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../shared/lib/firebase/config';

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
    addeAt: serverTimestamp(),
  });
}

/**장바구니 제거 */

export async function removeFromCart(userId, courseId) {
  const ref = doc(db, 'carts', cartDocId(userId, courseId));
  await deleteDoc(ref);
}
