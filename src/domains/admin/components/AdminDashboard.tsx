// 관리자페이지 강사승인

'use client';

import { useState, useCallback } from 'react';
import type { InstructorRequest, RequestFilter } from '../types/admin';
import { InstructorRequestCard } from './InstructorRequestCard';
import { InstructorApprovalModal } from './InstructorApprovalModal';
import styles from './AdminDashboard.module.css';

type InstructorManagementProps = {
  requests: InstructorRequest[];
  onProcess: (requestId: number, action: 'approve' | 'reject') => Promise<void>;
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
  const filteredRequests = requests.filter((req) => req.status === filter); //요청 배열에서, filter 항목에 맞는 목록들을 다시 저장

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
        await onProcess(selectedRequest.id, action); //onProcess 에 선택된 아이디-액션 비동기로 저장
        handleCloseModal();
        onRefresh(); //선택시 Void(빈값) 출력??
      } catch (error) {
        console.error('처리 실패:', error);
        alert('처리에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedRequest, onProcess, handleCloseModal, onRefresh],
  );

  return (
    <div className={styles['admin-dashboard']}>
      {/* 필터 탭 */}
      <div className={styles['admin-dashboard__filter-tabs']}>
        <button
          className={`${styles['admin-dashboard__filter-tab']} ${
            filter === 'PENDING' ? styles['admin-dashboard__filter-tab--active'] : ''
          }`}
          onClick={() => setFilter('PENDING')}
        >
          대기중
          <span
            className={`${styles['admin-dashboard__filter-count']} ${
              pendingCount > 0 ? styles['admin-dashboard__filter-count--warning'] : ''
            }`}
          >
            {pendingCount}
          </span>
        </button>
        <button
          className={`${styles['admin-dashboard__filter-tab']} ${
            filter === 'APPROVED' ? styles['admin-dashboard__filter-tab--active'] : ''
          }`}
          onClick={() => setFilter('APPROVED')}
        >
          승인됨
          <span className={styles['admin-dashboard__filter-count']}>{approvedCount}</span>
        </button>
        <button
          className={`${styles['admin-dashboard__filter-tab']} ${
            filter === 'REJECTED' ? styles['admin-dashboard__filter-tab--active'] : ''
          }`}
          onClick={() => setFilter('REJECTED')}
        >
          거절됨
          <span className={styles['admin-dashboard__filter-count']}>{rejectedCount}</span>
        </button>
      </div>

      {/* 탭에 들어가는 내용 */}
      <div className={styles['admin-dashboard__request-list']}>
        {filteredRequests.length === 0 ? (
          <div className={styles['admin-dashboard__empty-state']}>
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
