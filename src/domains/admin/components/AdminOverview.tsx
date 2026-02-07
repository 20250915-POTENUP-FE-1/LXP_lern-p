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
      <h2 className={styles.section__title}>전체 현황</h2>

      <div className={styles.stats__grid}>
        <div className={styles.stat__card}>
          <div className={styles.stat__icon}>
            <Users size={24} />
          </div>
          <div className={styles.stat__content}>
            <span className={styles.stat__value}>{stats.totalUsers.toLocaleString()}</span>
            <span className={styles.stat__label}>전체 사용자</span>
          </div>
        </div>

        <div className={styles.stat__card}>
          <div className={styles.stat__icon}>
            <BookOpen size={24} />
          </div>
          <div className={styles.stat__content}>
            <span className={styles.stat__value}>{stats.totalCourses.toLocaleString()}</span>
            <span className={styles.stat__label}>전체 강좌</span>
          </div>
        </div>

        <div className={styles.stat__card}>
          <div className={styles.stat__icon}>
            <UserCheck size={24} />
          </div>
          <div className={styles.stat__content}>
            <span className={styles.stat__value}>{stats.totalInstructors.toLocaleString()}</span>
            <span className={styles.stat__label}>등록 강사</span>
          </div>
        </div>

        <div
          className={`${styles.stat__card} ${stats.pendingRequests > 0 ? styles['stat__card--highlight'] : ''}`}
        >
          <div className={styles.stat__icon}>
            <Clock size={24} />
          </div>
          <div className={styles.stat__content}>
            <span className={styles.stat__value}>{stats.pendingRequests}</span>
            <span className={styles.stat__label}>승인 대기</span>
          </div>
        </div>
      </div>
    </div>
  );
};
