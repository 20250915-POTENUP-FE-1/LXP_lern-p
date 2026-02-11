'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/domains/user/types/user';
import { applyInstructor } from '@/domains/user/services/userService';
import { Modal } from '@/shared/ui/Modal';

type RoleRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onApplied: () => void;
};

export function RoleRequestModal({ isOpen, onClose, user, onApplied }: RoleRequestModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await applyInstructor();

      onClose();
      // TODO: 강사 승인 대기 안내 메시지
      onApplied?.();
      router.refresh();
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
