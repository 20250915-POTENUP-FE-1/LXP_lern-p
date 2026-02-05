'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminDashboard } from '../components';
import type { AdminCourseItem, AdminCourseDetail, DashboardStats } from '../types';
import { getAdminCourses, getAdminCourseDetail } from '../services/adminService';

export const AdminDashboardPage = () => {
  const [courses, setCourses] = useState<AdminCourseItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    averageRating: 0,
    totalStudents: 0,
    needsAttentionCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 강좌 목록 로딩
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const response = await getAdminCourses();
        setCourses(response.content);
        setStats(response.stats);
      } catch (err) {
        console.error('강좌 목록 로딩 실패:', err);
        setError('강좌 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  // 강좌 상세 정보 로딩
  const handleLoadCourseDetail = useCallback(
    async (courseId: string): Promise<AdminCourseDetail> => {
      return await getAdminCourseDetail(courseId);
    },
    []
  );

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
        강좌 목록을 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#dc2626' }}>
        {error}
      </div>
    );
  }

  return (
    <AdminDashboard
      courses={courses}
      stats={stats}
      onLoadCourseDetail={handleLoadCourseDetail}
    />
  );
};
