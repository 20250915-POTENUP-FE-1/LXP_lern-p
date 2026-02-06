'use client';

import { useState } from 'react';
import { LayoutDashboard, UserCheck, Settings } from 'lucide-react';
import styles from './AdminPage.module.css';

type AdminMenu = 'overview' | 'instructor';

type AdminPageProps = {
  overviewContent: React.ReactNode;
  instructorContent: React.ReactNode;
  pendingCount: number;
};

export const AdminPage = ({
  overviewContent,
  instructorContent,
  pendingCount,
}: AdminPageProps) => {
  const [activeMenu, setActiveMenu] = useState<AdminMenu>('overview');

  return (
    <div className={styles.layout}>
      {/* 사이드바 */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Settings size={20} />
          <span>관리자</span>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${activeMenu === 'overview' ? styles['navItem--active'] : ''}`}
            onClick={() => setActiveMenu('overview')}
          >
            <LayoutDashboard size={18} />
            <span>대시보드</span>
          </button>
          <button
            className={`${styles.navItem} ${activeMenu === 'instructor' ? styles['navItem--active'] : ''}`}
            onClick={() => setActiveMenu('instructor')}
          >
            <UserCheck size={18} />
            <span>강사 승인</span>
            {pendingCount > 0 && (
              <span className={styles.badge}>{pendingCount}</span>
            )}
          </button>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className={styles.main}>
        <header className={styles.mainHeader}>
          <h1 className={styles.pageTitle}>
            {activeMenu === 'overview' && '대시보드'}
            {activeMenu === 'instructor' && '강사 승인'}
          </h1>
        </header>

        <div className={styles.content}>
          {activeMenu === 'overview' && overviewContent}
          {activeMenu === 'instructor' && instructorContent}
        </div>
      </main>
    </div>
  );
};
