'use client';

import { useState, useEffect, useCallback } from 'react';
import { InstructorManagement } from '../components';
import type { InstructorRequest } from '../types';
import { getInstructorRequests, processInstructorRequest } from '../services/adminService';

export const InstructorManagementPage = () => {
  const [requests, setRequests] = useState<InstructorRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 요청 목록 로딩
  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getInstructorRequests();
      setRequests(response.requests);
    } catch (err) {
      console.error('요청 목록 로딩 실패:', err);
      setError('요청 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // 승인/거절 처리
  const handleProcess = useCallback(
    async (requestId: string, action: 'approve' | 'reject') => {
      await processInstructorRequest(requestId, action);
    },
    []
  );

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
        요청 목록을 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#dc2626' }}>
        {error}
      </div>
    );
  }

  return (
    <InstructorManagement
      requests={requests}
      onProcess={handleProcess}
      onRefresh={loadRequests}
    />
  );
};
