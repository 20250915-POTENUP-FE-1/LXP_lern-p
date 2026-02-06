'use client';

import { useState } from 'react';
import { LayoutDashboard, UserCheck } from 'lucide-react';
import styles from './AdminPage.module.css';

type AdminTab = 'overview' | 'instructor';

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
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <header className={styles.header}>
        <h1 className={styles.title}>관리자</h1>
      </header>

      {/* 탭 네비게이션 */}
      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles['tab--active'] : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={18} />
          대시보드
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'instructor' ? styles['tab--active'] : ''}`}
          onClick={() => setActiveTab('instructor')}
        >
          <UserCheck size={18} />
          강사 승인
          {pendingCount > 0 && (
            <span className={styles.badge}>{pendingCount}</span>
          )}
        </button>
      </nav>

      {/* 탭 콘텐츠 */}
      <main className={styles.content}>
        {activeTab === 'overview' && overviewContent}
        {activeTab === 'instructor' && instructorContent}
      </main>
    </div>
  );
};
