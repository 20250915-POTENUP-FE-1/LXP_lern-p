'use client';

import { useState, useCallback } from 'react';
import type { InstructorApplication, RequestFilter } from '../types/admin';
import { InstructorRequestCard } from './InstructorRequestCard';
import { InstructorApprovalModal } from './InstructorApprovalModal';
import styles from './InstructorManagement.module.css';

type InstructorManagementProps = {
  requests: InstructorApplication[];
  onProcess: (requestId: number, action: 'approve' | 'reject') => Promise<void>;
  onRefresh?: () => void;
  filter: RequestFilter;
  onFilterChange: (next: RequestFilter) => void;
};

export const InstructorManagement = ({
  requests,
  onProcess,
  onRefresh,
  filter,
  onFilterChange,
}: InstructorManagementProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<InstructorApplication | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 필터링된 요청 목록
  const filteredRequests =
    filter === 'ALL' ? requests : requests.filter((req) => req.status === filter);

  // 각 상태별 개수
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  // 요청 카드 클릭 핸들러
  const handleRequestClick = useCallback((request: InstructorApplication) => {
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
        await onProcess(selectedRequest.applicationId, action);
        handleCloseModal();
        onRefresh?.();
      } catch (error) {
        console.error('처리 실패:', error);
        alert('처리에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedRequest, onProcess, handleCloseModal, onRefresh],
  );

  const totalCount = requests.length;

  return (
    <div className={styles['instructor-management']}>
      <div className={styles['instructor-management__filter-tabs']}>
        <button
          className={`${styles['instructor-management__filter-tab']} ${
            filter === 'ALL' ? styles['instructor-management__filter-tab--active'] : ''
          }`}
          onClick={() => onFilterChange('ALL')}
        >
          전체
          <span className={styles['instructor-management__filter-count']}>{totalCount}</span>
        </button>
        <button
          className={`${styles['instructor-management__filter-tab']} ${
            filter === 'PENDING' ? styles['instructor-management__filter-tab--active'] : ''
          }`}
          onClick={() => onFilterChange('PENDING')}
        >
          대기중
          <span
            className={`${styles['instructor-management__filter-count']} ${
              pendingCount > 0 ? styles['instructor-management__filter-count--warning'] : ''
            }`}
          >
            {pendingCount}
          </span>
        </button>
        <button
          className={`${styles['instructor-management__filter-tab']} ${
            filter === 'APPROVED' ? styles['instructor-management__filter-tab--active'] : ''
          }`}
          onClick={() => onFilterChange('APPROVED')}
        >
          승인됨
          <span className={styles['instructor-management__filter-count']}>{approvedCount}</span>
        </button>
        <button
          className={`${styles['instructor-management__filter-tab']} ${
            filter === 'REJECTED' ? styles['instructor-management__filter-tab--active'] : ''
          }`}
          onClick={() => onFilterChange('REJECTED')}
        >
          거절됨
          <span className={styles['instructor-management__filter-count']}>{rejectedCount}</span>
        </button>
      </div>

      {/* 탭에 들어가는 내용 */}
      <div className={styles['instructor-management__request-list']}>
        {filteredRequests.length === 0 ? (
          <div className={styles['instructor-management__empty-state']}>
            {filter === 'PENDING' && '대기 중인 요청이 없습니다.'}
            {filter === 'APPROVED' && '승인된 요청이 없습니다.'}
            {filter === 'REJECTED' && '거절된 요청이 없습니다.'}
          </div>
        ) : (
          filteredRequests.map((request) => (
            <InstructorRequestCard
              key={request.applicationId}
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
