// 관리자페이지 대시보드 (페이지 접속시 기본)
'use client';

import { Users, BookOpen, UserCheck, Clock } from 'lucide-react';
import styles from './AdminOverview.module.css';

type AdminOverviewProps = {
  stats: {
    totalUsers: number;
    totalCourses: number;
    totalInstructors: number;
    pendingRequests: number;
  };
};

//TODO:  AdminOverviewProps.stats 를 API 로 가져온 값과 연결??

export const AdminOverview = ({ stats }: AdminOverviewProps) => {
  return (
    //전체현황 내용, 아이콘 포함됨
    <div className={styles.overview}>
      <h2 className={styles.sectionTitle}>전체 현황</h2>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.totalUsers.toLocaleString()}</span>
            <span className={styles.statLabel}>전체 사용자</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.totalCourses.toLocaleString()}</span>
            <span className={styles.statLabel}>전체 강좌</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <UserCheck size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.totalInstructors.toLocaleString()}</span>
            <span className={styles.statLabel}>등록 강사</span>
          </div>
        </div>

        <div
          className={`${styles.statCard} ${stats.pendingRequests > 0 ? styles['statCard--highlight'] : ''}`}
        >
          <div className={styles.statIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.pendingRequests}</span>
            <span className={styles.statLabel}>승인 대기</span>
          </div>
        </div>
      </div>
    </div>
  );
};
