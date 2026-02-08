// 강사승인 모달

'use client';

import { X, User, Mail, Calendar } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import type { InstructorRequest } from '../types/admin';
import styles from './InstructorApprovalModal.module.css';
import { formatDate } from '@/shared/util/formatDate';

type InstructorApprovalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  request: InstructorRequest | null;
  onApprove: () => void;
  onReject: () => void;
  isProcessing?: boolean;
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
      <div className={styles['instructor-approval-modal']}>
        {/* 헤더 */}
        <div className={styles['instructor-approval-modal__header']}>
          <h2 className={styles['instructor-approval-modal__title']}>강사 승인 요청</h2>
          <button
            className={styles['instructor-approval-modal__close-button']}
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {request ? (
          <>
            {/* 요청 정보 */}
            <div className={styles['instructor-approval-modal__content']}>
              <div className={styles['instructor-approval-modal__info-item']}>
                <User size={18} />
                <div className={styles['instructor-approval-modal__info-content']}>
                  <span className={styles['instructor-approval-modal__info-label']}>닉네임</span>
                  <span className={styles['instructor-approval-modal__info-value']}>
                    {request.nickname}
                  </span>
                </div>
              </div>
              <div className={styles['instructor-approval-modal__info-item']}>
                <Mail size={18} />
                <div className={styles['instructor-approval-modal__info-content']}>
                  <span className={styles['instructor-approval-modal__info-label']}>이메일</span>
                  <span className={styles['instructor-approval-modal__info-value']}>
                    {request.email}
                  </span>
                </div>
              </div>
              <div className={styles['instructor-approval-modal__info-item']}>
                <Calendar size={18} />
                <div className={styles['instructor-approval-modal__info-content']}>
                  <span className={styles['instructor-approval-modal__info-label']}>신청일</span>
                  <span className={styles['instructor-approval-modal__info-value']}>
                    {formatDate(request.requestedAt)}
                  </span>
                </div>
              </div>
              {request.processedAt && (
                <div className={styles['instructor-approval-modal__info-item']}>
                  <Calendar size={18} />
                  <div className={styles['instructor-approval-modal__info-content']}>
                    <span className={styles['instructor-approval-modal__info-label']}>처리일</span>
                    <span className={styles['instructor-approval-modal__info-value']}>
                      {formatDate(request.processedAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 액션 버튼 (대기중일 때만 표시) */}
            {isPending && (
              <div className={styles['instructor-approval-modal__actions']}>
                <button
                  className={styles['instructor-approval-modal__button-reject']}
                  onClick={onReject}
                  disabled={isProcessing}
                >
                  {isProcessing ? '처리 중...' : '거절'}
                </button>
                <button
                  className={styles['instructor-approval-modal__button-approve']}
                  onClick={onApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? '처리 중...' : '승인'}
                </button>
              </div>
            )}

            {/* 이미 처리된 경우 상태 표시 */}
            {!isPending && (
              <div className={styles['instructor-approval-modal__status-message']}>
                {request.status === 'APPROVED' && (
                  <span className={styles['instructor-approval-modal__status--approved']}>
                    이 요청은 승인되었습니다.
                  </span>
                )}
                {request.status === 'REJECTED' && (
                  <span className={styles['instructor-approval-modal__status--rejected']}>
                    이 요청은 거절되었습니다.
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className={styles['instructor-approval-modal__error']}>
            <p>요청 정보를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
