'use client';

import { useState, useEffect } from 'react';
import { AdminOverview } from '@/domains/admin/components/AdminOverview';
import type { AdminStats, InstructorRequest } from '@/domains/admin/types/admin';
import { USE_MOCK } from '@/shared/constants/config';
import { MOCK_INSTRUCTOR_REQUESTS } from '@/mocks/admin.mock';
import styles from '@/app/admin/AdminPage.module.css';

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

export function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalInstructors: 0,
    pendingRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);

        if (USE_MOCK) {
          setStats(calcStats(MOCK_INSTRUCTOR_REQUESTS));
          return;
        }

        // TODO: API 연동
        // const statsRes = await api('/api/admin/stats');
        // setStats(statsRes);
      } catch (err) {
        console.error('통계 로딩 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        데이터를 불러오는 중...
      </div>
    );
  }

  return (
    <>
      {/* 제목 헤더 */}
      <header className={styles['admin-page__header']}>
        <h1 className={styles['admin-page__title']}>대시보드</h1>
      </header>

      {/* 콘텐츠 영역 */}
      <div className={styles['admin-page__content']}>
        <AdminOverview stats={stats} />
      </div>
    </>
  );
}
