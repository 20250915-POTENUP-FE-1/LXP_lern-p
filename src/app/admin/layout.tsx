'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AdminSidebar } from '@/domains/admin/components/AdminSidebar';
import styles from '@/app/admin/AdminPage.module.css';
import { USE_MOCK } from '@/shared/constants/config';
import { MOCK_INSTRUCTOR_REQUESTS } from '@/mocks/admin.mock';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const loadPendingCount = async () => {
      try {
        if (USE_MOCK) {
          const count = MOCK_INSTRUCTOR_REQUESTS.filter(
            (request) => request.status === 'PENDING',
          ).length;
          setPendingCount(count);
          return;
        }

        // TODO: API 연동
        // const requestsRes = await api('/api/admin/instructor-requests');
        // const count = requestsRes.requests.filter((request) => request.status === 'PENDING').length;
        // setPendingCount(count);
      } catch (error) {
        console.error('승인 대기 건수 로딩 실패:', error);
      }
    };

    loadPendingCount();
  }, []);

  return (
    // TODO: 관리자 권한 가드 필요
    <div className={styles['auth-shell']}>
      <div className={styles['admin-layout']}>
        {/* 모바일 헤더 */}
        <header className={styles['admin-layout__mobile-header']}>
          <button
            className={styles['admin-layout__menu-toggle']}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className={styles['admin-layout__mobile-title']}>관리자</span>
        </header>

        {/* 오버레이 */}
        {isSidebarOpen && (
          <div
            className={styles['admin-layout__overlay']}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 사이드바 */}
        <aside
          className={`${styles['admin-layout__sidebar']} ${
            isSidebarOpen ? styles['admin-layout__sidebar--open'] : ''
          }`}
        >
          <AdminSidebar pendingCount={pendingCount} />
        </aside>

        {/* 메인 콘텐츠 */}
        <main className={styles['admin-layout__main']}>{children}</main>
      </div>
    </div>
  );
}
