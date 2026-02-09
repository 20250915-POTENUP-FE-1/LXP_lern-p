import type { AdminStats } from '@/domains/admin/types/admin';
import { AdminOverview } from '@/domains/admin/components/AdminOverview';
import { USE_MOCK } from '@/shared/constants/config';
import { MOCK_INSTRUCTOR_REQUESTS } from '@/mocks/admin.mock';
import styles from '../AdminPage.module.css';

async function getAdminStats(): Promise<AdminStats> {
  if (USE_MOCK) {
    const pending = MOCK_INSTRUCTOR_REQUESTS.filter((r) => r.status === 'PENDING').length;
    const approved = MOCK_INSTRUCTOR_REQUESTS.filter((r) => r.status === 'APPROVED').length;

    return {
      totalUsers: 1234,
      totalCourses: 56,
      totalInstructors: approved + 15,
      pendingRequests: pending,
    };
  }

  // TODO: API 연동
  // return await getApi<AdminStats>('/api/admin/stats');

  return { totalUsers: 0, totalCourses: 0, totalInstructors: 0, pendingRequests: 0 };
}

export const revalidate = 0;

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <>
      <header className={styles['admin-page__header']}>
        <h1 className={styles['admin-page__title']}>대시보드</h1>
      </header>

      <div className={styles['admin-page__content']}>
        <AdminOverview stats={stats} />
      </div>
    </>
  );
}
