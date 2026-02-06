'use client';

import { useState, useCallback } from 'react';
import type { InstructorRequest, RequestFilter } from '../types/admin';
import { InstructorRequestCard } from './InstructorRequestCard';
import { InstructorApprovalModal } from './InstructorApprovalModal';
import styles from './AdminDashboard.module.css';

type InstructorManagementProps = {
  requests: InstructorRequest[];
  onProcess: (requestId: string, action: 'approve' | 'reject') => Promise<void>;
  onRefresh: () => void;
};

export const InstructorManagement = ({
  requests,
  onProcess,
  onRefresh,
}: InstructorManagementProps) => {
  const [filter, setFilter] = useState<RequestFilter>('PENDING');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<InstructorRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 필터링된 요청 목록
  const filteredRequests = requests.filter((req) => req.status === filter);

  // 각 상태별 개수
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  // 요청 카드 클릭 핸들러
  const handleRequestClick = useCallback((request: InstructorRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  }, []);

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  }, []);

  // 승인/거절 처리 핸들러
  const handleProcess = useCallback(
    async (action: 'approve' | 'reject') => {
      if (!selectedRequest) return;

      setIsProcessing(true);
      try {
        await onProcess(selectedRequest.id, action);
        handleCloseModal();
        onRefresh();
      } catch (error) {
        console.error('처리 실패:', error);
        alert('처리에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedRequest, onProcess, handleCloseModal, onRefresh]
  );

  return (
    <div className={styles.container}>
      {/* 필터 탭 */}
      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterTab} ${filter === 'PENDING' ? styles['filterTab--active'] : ''}`}
          onClick={() => setFilter('PENDING')}
        >
          대기중
          <span className={`${styles.filterCount} ${pendingCount > 0 ? styles['filterCount--warning'] : ''}`}>
            {pendingCount}
          </span>
        </button>
        <button
          className={`${styles.filterTab} ${filter === 'APPROVED' ? styles['filterTab--active'] : ''}`}
          onClick={() => setFilter('APPROVED')}
        >
          승인됨
          <span className={styles.filterCount}>{approvedCount}</span>
        </button>
        <button
          className={`${styles.filterTab} ${filter === 'REJECTED' ? styles['filterTab--active'] : ''}`}
          onClick={() => setFilter('REJECTED')}
        >
          거절됨
          <span className={styles.filterCount}>{rejectedCount}</span>
        </button>
      </div>

      {/* 요청 목록 */}
      <div className={styles.requestList}>
        {filteredRequests.length === 0 ? (
          <div className={styles.emptyState}>
            {filter === 'PENDING' && '대기 중인 요청이 없습니다.'}
            {filter === 'APPROVED' && '승인된 요청이 없습니다.'}
            {filter === 'REJECTED' && '거절된 요청이 없습니다.'}
          </div>
        ) : (
          filteredRequests.map((request) => (
            <InstructorRequestCard
              key={request.id}
              request={request}
              onClick={() => handleRequestClick(request)}
            />
          ))
        )}
      </div>

      {/* 승인/거절 모달 */}
      <InstructorApprovalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        request={selectedRequest}
        onApprove={() => handleProcess('approve')}
        onReject={() => handleProcess('reject')}
        isProcessing={isProcessing}
      />
    </div>
  );
};
