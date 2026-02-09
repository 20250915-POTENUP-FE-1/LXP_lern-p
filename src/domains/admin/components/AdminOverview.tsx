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

export const AdminOverview = ({ stats }: AdminOverviewProps) => {
  return (
    <div className={styles['admin-overview']}>
      <h2 className={styles['admin-overview__section-title']}>전체 현황</h2>

      <div className={styles['admin-overview__stats-grid']}>
        <div className={styles['admin-overview__stat-card']}>
          <div className={styles['admin-overview__stat-icon']}>
            <Users size={24} />
          </div>
          <div className={styles['admin-overview__stat-content']}>
            <span className={styles['admin-overview__stat-value']}>
              {stats.totalUsers.toLocaleString()}
            </span>
            <span className={styles['admin-overview__stat-label']}>전체 사용자</span>
          </div>
        </div>

        <div className={styles['admin-overview__stat-card']}>
          <div className={styles['admin-overview__stat-icon']}>
            <BookOpen size={24} />
          </div>
          <div className={styles['admin-overview__stat-content']}>
            <span className={styles['admin-overview__stat-value']}>
              {stats.totalCourses.toLocaleString()}
            </span>
            <span className={styles['admin-overview__stat-label']}>전체 강좌</span>
          </div>
        </div>

        <div className={styles['admin-overview__stat-card']}>
          <div className={styles['admin-overview__stat-icon']}>
            <UserCheck size={24} />
          </div>
          <div className={styles['admin-overview__stat-content']}>
            <span className={styles['admin-overview__stat-value']}>
              {stats.totalInstructors.toLocaleString()}
            </span>
            <span className={styles['admin-overview__stat-label']}>등록 강사</span>
          </div>
        </div>

        <div
          className={`${styles['admin-overview__stat-card']} ${
            stats.pendingRequests > 0 ? styles['admin-overview__stat-card--highlight'] : ''
          }`}
        >
          <div className={styles['admin-overview__stat-icon']}>
            <Clock size={24} />
          </div>
          <div className={styles['admin-overview__stat-content']}>
            <span className={styles['admin-overview__stat-value']}>{stats.pendingRequests}</span>
            <span className={styles['admin-overview__stat-label']}>승인 대기</span>
          </div>
        </div>
      </div>
    </div>
  );
};
