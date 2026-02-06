'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminPage, AdminOverview, InstructorManagement } from '../components';
import type { InstructorRequest, AdminStats } from '../types';
import {
  getInstructorRequests,
  processInstructorRequest,
  getAdminStats,
} from '../services/adminService';

export const AdminDashboardPage = () => {
  const [requests, setRequests] = useState<InstructorRequest[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalInstructors: 0,
    pendingRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로딩
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [requestsRes, statsRes] = await Promise.all([
        getInstructorRequests(),
        getAdminStats(),
      ]);

      setRequests(requestsRes.requests);
      setStats(statsRes);
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 승인/거절 처리
  const handleProcess = useCallback(
    async (requestId: string, action: 'approve' | 'reject') => {
      await processInstructorRequest(requestId, action);
    },
    []
  );

  // 대기 중인 요청 수
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        데이터를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-danger)' }}>
        {error}
      </div>
    );
  }

  return (
    <AdminPage
      pendingCount={pendingCount}
      overviewContent={<AdminOverview stats={stats} />}
      instructorContent={
        <InstructorManagement
          requests={requests}
          onProcess={handleProcess}
          onRefresh={loadData}
        />
      }
    />
  );
};
