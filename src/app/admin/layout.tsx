'use client';

import { useState } from 'react';
import { AppShell } from '@/shared/ui/AppShell';
import { AdminPageSidebar } from '@/domains/admin/components/AdminPageSidebar';
import { Menu, X } from 'lucide-react';
import styles from '@/app/admin/AdminLayout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AppShell>
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
          <AdminPageSidebar />
        </aside>

        {/* 메인 콘텐츠 */}
        <main className={styles['admin-layout__main']}>{children}</main>
      </div>
    </AppShell>
  );
}
