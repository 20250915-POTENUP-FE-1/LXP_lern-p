'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminClientPage, AdminOverview, InstructorManagement } from '../components';
import type { InstructorRequest, AdminStats, InstructorRequestStatus } from '../types/admin';
import { USE_MOCK } from '@/shared/constants/config';
import { MOCK_INSTRUCTOR_REQUESTS } from '@/mocks/admin.mock';

const calcStats = (requests: InstructorRequest[]): AdminStats => {
  const pending = requests.filter((r) => r.status === 'PENDING').length;
  const approved = requests.filter((r) => r.status === 'APPROVED').length;

  return {
    totalUsers: 1234,
    totalCourses: 56,
    totalInstructors: approved + 15,
    pendingRequests: pending,
  };
};

export const AdminDashboardClientPage = () => {
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

      // TODO: 강사 승인 요청 목록 불러오기
      if (USE_MOCK) {
        setRequests(MOCK_INSTRUCTOR_REQUESTS);
        setStats(calcStats(MOCK_INSTRUCTOR_REQUESTS));
        return;
      }

      //TODO: API 생기면 분기처리하기
      // const [requestsRes, statsRes] = await Promise.all([
      //   api<{ requests: InstructorRequest[]; total: number }>('/api/admin/instructor-requests'),
      //   api<AdminStats>('/api/admin/stats'),
      // ]);

      // setRequests(requestsRes.requests);
      // setStats(statsRes);
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 승인/거절 처리
  const handleProcess = useCallback(
    async (requestId: number, action: 'approve' | 'reject') => {
      if (!requestId) return;
      // TODO: 강사 승인 처리 결과
      if (USE_MOCK) {
        const newStatus: InstructorRequestStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
        const processedAt = new Date().toISOString();

        setRequests((prev) => {
          const next = prev.map((r) =>
            r.id === requestId ? { ...r, status: newStatus, processedAt } : r,
          );
          setStats(calcStats(next));
          return next;
        });
        return;
      }

      //TODO: API 생기면 분기처리하기
      // await api(`/api/admin/instructor-requests/${encodeURIComponent(requestId)}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ action }),
      // });

      // 처리 후 갱신(너의 구조 유지)
      await loadData();
    },
    [loadData],
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
    <AdminClientPage
      pendingCount={pendingCount}
      overviewContent={<AdminOverview stats={stats} />}
      instructorContent={
        <InstructorManagement requests={requests} onProcess={handleProcess} onRefresh={loadData} />
      }
    />
  );
};
