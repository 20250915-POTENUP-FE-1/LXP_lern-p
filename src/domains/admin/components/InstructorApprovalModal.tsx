// 강사승인 모달

'use client';

import { X, User, Mail, Calendar } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import type { InstructorRequest } from '../types/admin';
import styles from './InstructorApprovalModal.module.css';

type InstructorApprovalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  request: InstructorRequest | null;
  onApprove: () => void;
  onReject: () => void;
  isProcessing?: boolean;
};

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const InstructorApprovalModal = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
  isProcessing = false,
}: InstructorApprovalModalProps) => {
  if (!isOpen) return null;

  const isPending = request?.status === 'PENDING';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>강사 승인 요청</h2>
          <button className={styles.close__button} onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        {request ? (
          <>
            {/* 요청 정보 */}
            <div className={styles.content}>
              <div className={styles.info__item}>
                <User size={18} />
                <div className={styles.info__content}>
                  <span className={styles.info__label}>닉네임</span>
                  <span className={styles.info__value}>{request.nickname}</span>
                </div>
              </div>
              <div className={styles.info__item}>
                <Mail size={18} />
                <div className={styles.info__content}>
                  <span className={styles.info__label}>이메일</span>
                  <span className={styles.info__value}>{request.email}</span>
                </div>
              </div>
              <div className={styles.info__item}>
                <Calendar size={18} />
                <div className={styles.info__content}>
                  <span className={styles.info__label}>신청일</span>
                  <span className={styles.info__value}>{formatDate(request.requestedAt)}</span>
                </div>
              </div>
              {request.processedAt && (
                <div className={styles.info__item}>
                  <Calendar size={18} />
                  <div className={styles.info__content}>
                    <span className={styles.info__label}>처리일</span>
                    <span className={styles.info__value}>{formatDate(request.processedAt)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 액션 버튼 (대기중일 때만 표시) */}
            {isPending && (
              <div className={styles.actions}>
                <button
                  className={styles.button__reject}
                  onClick={onReject}
                  disabled={isProcessing}
                >
                  {isProcessing ? '처리 중...' : '거절'}
                </button>
                <button
                  className={styles.button__approve}
                  onClick={onApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? '처리 중...' : '승인'}
                </button>
              </div>
            )}

            {/* 이미 처리된 경우 상태 표시 */}
            {!isPending && (
              <div className={styles.status__message}>
                {request.status === 'APPROVED' && (
                  <span className={styles.status__approved}>이 요청은 승인되었습니다.</span>
                )}
                {request.status === 'REJECTED' && (
                  <span className={styles.status__rejected}>이 요청은 거절되었습니다.</span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className={styles.error}>
            <p>요청 정보를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
