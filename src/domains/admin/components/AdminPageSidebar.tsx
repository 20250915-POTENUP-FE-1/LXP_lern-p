'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserCheck, Settings } from 'lucide-react';
import styles from '@/domains/admin/components/AdminPageSidebar.module.css';

type AdminPageSidebarProps = {
  pendingCount?: number;
};

export function AdminPageSidebar({ pendingCount = 0 }: AdminPageSidebarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* 사이드바 헤더 */}
      <div className={styles['admin-layout__sidebar-header']}>
        <Settings size={20} />
        <span>관리자</span>
      </div>

      {/* 네비게이션 */}
      <nav className={styles['admin-layout__nav']}>
        <Link
          href="/admin"
          className={`${styles['admin-layout__nav-item']} ${
            isActive('/admin') ? styles['admin-layout__nav-item--active'] : ''
          }`}
        >
          <LayoutDashboard size={18} />
          <span className={styles['admin-layout__nav-text']}>대시보드</span>
        </Link>

        <Link
          href="/admin/instructor"
          className={`${styles['admin-layout__nav-item']} ${
            isActive('/admin/instructor') ? styles['admin-layout__nav-item--active'] : ''
          }`}
        >
          <UserCheck size={18} />
          <span className={styles['admin-layout__nav-text']}>강사 승인</span>
          {pendingCount > 0 && (
            <span className={styles['admin-layout__nav-badge']}>{pendingCount}</span>
          )}
        </Link>
      </nav>
    </>
  );
}
