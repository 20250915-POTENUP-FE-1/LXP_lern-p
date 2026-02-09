import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserCheck, Settings } from 'lucide-react';
import styles from '@/domains/admin/components/AdminSidebar.module.css';

type AdminPageSidebarProps = {
  pendingCount?: number;
};

export function AdminSidebar({ pendingCount = 0 }: AdminPageSidebarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* 사이드바 헤더 */}
      <div className={styles['admin-sidebar__header']}>
        <Settings size={20} />
        <span>관리자</span>
      </div>

      {/* 네비게이션 */}
      <nav className={styles['admin-sidebar__nav']}>
        <Link
          href="/admin"
          className={`${styles['admin-sidebar__nav-item']} ${
            isActive('/admin') ? styles['admin-sidebar__nav-item--active'] : ''
          }`}
        >
          <LayoutDashboard size={18} />
          <span className={styles['admin-sidebar__nav-text']}>대시보드</span>
        </Link>

        <Link
          href="/admin/instructor"
          className={`${styles['admin-sidebar__nav-item']} ${
            isActive('/admin/instructor') ? styles['admin-sidebar__nav-item--active'] : ''
          }`}
        >
          <UserCheck size={18} />
          <span className={styles['admin-sidebar__nav-text']}>강사 승인</span>
          {pendingCount > 0 && (
            <span className={styles['admin-sidebar__nav-badge']}>{pendingCount}</span>
          )}
        </Link>
      </nav>
    </>
  );
}
