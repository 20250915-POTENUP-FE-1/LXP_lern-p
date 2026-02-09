'use client';

import { useState, useEffect, useCallback } from 'react';
import { InstructorManagement } from '@/domains/admin/components/InstructorManagement';
import type { InstructorApplication, ApplicationStatus } from '@/domains/admin/types/admin';
import { USE_MOCK } from '@/shared/constants/config';
import { MOCK_INSTRUCTOR_REQUESTS } from '@/mocks/admin.mock';
import styles from '@/app/admin/AdminPage.module.css';

export function InstructorManagementClientPage() {
  const [requests, setRequests] = useState<InstructorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로딩
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (USE_MOCK) {
        setRequests(MOCK_INSTRUCTOR_REQUESTS);
        return;
      }

      // TODO: API 연동
      // const requestsRes = await api('/api/admin/instructor-requests');
      // setRequests(requestsRes.requests);
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

      if (USE_MOCK) {
        const newStatus: ApplicationStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
        const processedAt = new Date().toISOString();

        setRequests((prev) =>
          prev.map((r) =>
            r.applicationId === requestId ? { ...r, status: newStatus, processedAt } : r,
          ),
        );
        return;
      }

      // TODO: API 연동
      // await api(`/api/admin/instructor-requests/${requestId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ action }),
      // });

      await loadData();
    },
    [loadData],
  );

  // 로딩 상태
  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        데이터를 불러오는 중...
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-danger)' }}>
        {error}
      </div>
    );
  }

  // 정상 렌더링
  return (
    <>
      <header className={styles['admin-page__header']}>
        <h1 className={styles['admin-page__title']}>강사 승인</h1>
      </header>
      <div className={styles['admin-page__content']}>
        <InstructorManagement requests={requests} onProcess={handleProcess} onRefresh={loadData} />
      </div>
    </>
  );
}
