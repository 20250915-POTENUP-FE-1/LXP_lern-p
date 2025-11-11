import { updateUserToInstructor } from '@/domains/user/services/userService';
import { Modal } from '@/shared/ui/Modal';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function RoleRequestModal({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      // Firestore roles 업데이트 (예: ["USER", "INSTRUCTOR"])
      await updateUserToInstructor(user.id);

      onClose();
      navigate('/mypage');
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
        <button type="button" className="modal__button" onClick={handleConfirm} disabled={loading}>
          {loading ? '처리 중...' : '확인'}
        </button>
      </footer>
    </Modal>
  );
}
