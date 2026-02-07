// 관리자 페이지 메인 페이지 - 사이드바 및 메인페이지 포함
'use client';

import { useState } from 'react';
import { LayoutDashboard, UserCheck, Settings, Menu, X } from 'lucide-react';
import styles from './AdminClientPage.module.css';

type AdminMenu = 'overview' | 'instructor';

type AdminClientPageProps = {
  overviewContent: React.ReactNode; //??
  instructorContent: React.ReactNode;
  pendingCount: number;
};

export const AdminClientPage = ({
  overviewContent,
  instructorContent,
  pendingCount,
}: AdminClientPageProps) => {
  const [activeMenu, setActiveMenu] = useState<AdminMenu>('overview'); // 기본
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = (menu: AdminMenu) => {
    setActiveMenu(menu);
    setIsSidebarOpen(false); // 모바일에서 메뉴 선택 시 사이드바 닫기
  };

  return (
    <div className={styles.admin}>
      {/* 모바일 헤더 */}
      <header className={styles.admin__mobile__header}>
        <button
          className={styles['admin__menu-toggle']}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? '메뉴 닫기' : '메뉴 열기'} //??
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className={styles['admin__mobile-title']}>관리자</span>
      </header>

      {/* 오버레이 (모바일) */}
      {isSidebarOpen && (
        <div className={styles.admin__overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* 사이드바 */}
      <aside
        className={`${styles.admin__sidebar} ${isSidebarOpen ? styles['admin__sidebar--open'] : ''}`}
      >
        <div className={styles['admin__sidebar-header']}>
          <Settings size={20} />
          <span>관리자</span>
        </div>

        <nav className={styles.admin__nav}>
          <button
            className={`${styles['admin__nav-item']} ${activeMenu === 'overview' ? styles['admin__nav-item--active'] : ''}`}
            onClick={() => handleMenuClick('overview')}
          >
            <LayoutDashboard size={18} />
            <span className={styles['admin__nav-text']}>대시보드</span>
          </button>
          <button
            className={`${styles['admin__nav-item']} ${activeMenu === 'instructor' ? styles['admin__nav-item--active'] : ''}`}
            onClick={() => handleMenuClick('instructor')}
          >
            <UserCheck size={18} />
            <span className={styles['admin__nav-text']}>강사 승인</span>
            {pendingCount > 0 && <span className={styles['admin__nav-badge']}>{pendingCount}</span>}
          </button>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className={styles.admin__main}>
        <header className={styles.admin__header}>
          <h1 className={styles.admin__title}>
            {activeMenu === 'overview' && '대시보드'}
            {activeMenu === 'instructor' && '강사 승인'}
          </h1>
        </header>

        <div className={styles.admin__content}>
          {activeMenu === 'overview' && overviewContent}
          {activeMenu === 'instructor' && instructorContent}
        </div>
      </main>
    </div>
  );
};
