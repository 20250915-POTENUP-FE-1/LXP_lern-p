'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { InstructorManagement } from '@/domains/admin/components/InstructorManagement';
import type {
  ApplicationStatus,
  InstructorApplication,
  GetInstructorApplicationsParams,
  RequestFilter,
} from '@/domains/admin/types/admin';
import { USE_MOCK } from '@/shared/constants/config';
import { MOCK_INSTRUCTOR_REQUESTS } from '@/mocks/admin.mock';
import {
  getInstructorApplicaions,
  processInstructorApplication,
} from '@/domains/admin/services/adminService';
import styles from '@/app/admin/AdminPage.module.css';

const DEFAULT_FILTER: RequestFilter = 'PENDING';

export function InstructorManagementClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialFilter = (searchParams.get('status') as RequestFilter) ?? DEFAULT_FILTER;
  const [filter, setFilter] = useState<RequestFilter>(initialFilter);
  const [requests, setRequests] = useState<InstructorApplication[]>(() =>
    USE_MOCK ? [...MOCK_INSTRUCTOR_REQUESTS] : [],
  );
  const [isLoading, setIsLoading] = useState(!USE_MOCK);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로딩
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (USE_MOCK) {
        const snapshot = [...MOCK_INSTRUCTOR_REQUESTS];
        setRequests(snapshot);
        const pending = snapshot.filter((request) => request.status === 'PENDING').length;
        dispatchPendingCount(pending);
        return;
      }

      const params: GetInstructorApplicationsParams = {
        page: 0,
        size: 100,
      };

      const result = await getInstructorApplicaions(params);
      const content = Array.isArray(result.content) ? result.content : [];
      setRequests(content);
      const pending = content.filter((request) => request.status === 'PENDING').length;
      dispatchPendingCount(pending);
    } catch (err) {
      console.error('데이터 로딩 실패:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!USE_MOCK) {
      void loadData();
    } else {
      const initialPending = MOCK_INSTRUCTOR_REQUESTS.filter(
        (request) => request.status === 'PENDING',
      ).length;
      dispatchPendingCount(initialPending);
    }
  }, [loadData]);

  useEffect(() => {
    const currentStatus = searchParams.get('status');

    if (filter === 'ALL') {
      if (currentStatus) {
        const next = new URLSearchParams(searchParams.toString());
        next.delete('status');
        void router.replace(`${pathname}${next.toString() ? `?${next.toString()}` : ''}`, {
          scroll: false,
        });
      }
      return;
    }

    if (currentStatus !== filter) {
      const next = new URLSearchParams(searchParams.toString());
      next.set('status', filter);
      void router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }
  }, [filter, pathname, router]);

  const handleProcess = useCallback(
    async (requestId: number, action: 'approve' | 'reject') => {
      if (!requestId) return;

      if (USE_MOCK) {
        const newStatus: ApplicationStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
        const request = MOCK_INSTRUCTOR_REQUESTS.find((r) => r.applicationId === requestId);
        if (request) {
          request.status = newStatus;
        }
        const updatedRequests = [...MOCK_INSTRUCTOR_REQUESTS];
        setRequests(updatedRequests);
        const pending = updatedRequests.filter((req) => req.status === 'PENDING').length;
        dispatchPendingCount(pending);
        return;
      }

      await processInstructorApplication(requestId, action === 'approve' ? 'APPROVED' : 'REJECTED');
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
        <InstructorManagement
          requests={requests}
          onProcess={handleProcess}
          onRefresh={loadData}
          filter={filter}
          onFilterChange={(next) => setFilter(next)}
        />
      </div>
    </>
  );
}

function dispatchPendingCount(count: number) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('mock-pending-count', { detail: count }));
}
