import { useEffect, useState } from 'react';
import { addToCart, getCartStatus } from '../services/cartService';

export function useCart(currentUser, courseId) {
  const [incart, setincart] = useState(false);
  const [cartPending, setPending] = useState(false);

  //장바구니 여부 확인
  useEffect(() => {
    if (!currentUser?.id || !courseId) {
      setincart(false);
      return;
    }
    (async () => {
      try {
        const exists = await getCartStatus(currentUser.id, courseId);
        setincart(exists);
      } catch (e) {
        console.error('장바구니 상태 확인 실패', e);
        setPending(false);
      }
    })();
  }, [currentUser?.id, courseId]);

  // 추가
  const handleAddCart = async () => {
    if (!currentUser?.id) throw new Error('로그인이 필요합니다');
    if (!courseId) throw new Error('유효하지 않은 강좌 입니다');

    setPending(true);
    try {
      await addToCart(currentUser.id, courseId);
      setincart(true);
    } finally {
      setPending(false);
    }
  };

  return { incart, cartPending, handleAddCart };
}
