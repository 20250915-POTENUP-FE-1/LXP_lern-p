'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/domains/user/types/user';
import { updateUserToInstructor } from '@/domains/user/services/userService';
import { Modal } from '@/shared/ui/Modal';

type RoleRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
};

export function RoleRequestModal({ isOpen, onClose, user }: RoleRequestModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    // 혹시라도 user가 null이면 바로 막기
    if (!user) return;

    try {
      setLoading(true);
      // Firestore roles 업데이트 (예: ["USER", "INSTRUCTOR"])
      await updateUserToInstructor(user.id);

      onClose();
      router.push('/mypage');
    } catch (err) {
      console.error('강사 권한 부여 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className="modal__header">
        <h2 id="role-request-title" className="modal__title">
          강사가 되시겠습니까?
        </h2>
        <button type="button" className="modal__close" aria-label="닫기" onClick={onClose}>
          ×
        </button>
      </header>

      <div className="modal__body" style={{ paddingTop: '8px' }}>
        <p className="modal__text">강의를 등록하려면 강사 권한이 필요합니다.</p>
      </div>

      <footer className="modal__actions">
        <button
          type="button"
          className="modal__button"
          onClick={handleConfirm}
          disabled={loading || !user}
        >
          {loading ? '처리 중...' : '확인'}
        </button>
      </footer>
    </Modal>
  );
}
