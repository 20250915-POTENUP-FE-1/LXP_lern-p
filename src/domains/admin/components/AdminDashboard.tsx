'use client';

import { useState, useCallback } from 'react';
import { Search, BookOpen, Star, Users, AlertTriangle } from 'lucide-react';
import type {
  AdminCourseItem,
  AdminCourseDetail,
  DashboardStats,
  CourseFilter,
} from '../types/admin';
import { StatCard } from './StatCard';
import { CourseTable } from './CourseTable';
import { CourseDetailModal } from './CourseDetailModal';
import styles from './AdminDashboard.module.css';

type AdminDashboardProps = {
  courses: AdminCourseItem[];
  stats: DashboardStats;
  onLoadCourseDetail: (courseId: string) => Promise<AdminCourseDetail>;
};

export const AdminDashboard = ({
  courses,
  stats,
  onLoadCourseDetail,
}: AdminDashboardProps) => {
  const [filter, setFilter] = useState<CourseFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<AdminCourseDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // 필터링된 강좌 목록
  const filteredCourses = courses.filter((course) => {
    const matchesFilter = filter === 'all' || course.needsAttention;
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 강좌 클릭 핸들러
  const handleCourseClick = useCallback(
    async (courseId: string) => {
      setIsModalOpen(true);
      setIsLoadingDetail(true);
      try {
        const detail = await onLoadCourseDetail(courseId);
        setSelectedCourse(detail);
      } catch (error) {
        console.error('강좌 상세 정보 로딩 실패:', error);
        setSelectedCourse(null);
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [onLoadCourseDetail]
  );

  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>강좌 관리 대시보드</h1>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="강좌명 또는 강사명으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 통계 카드 */}
      <div className={styles.statsGrid}>
        <StatCard
          label="전체 강좌"
          value={stats.totalCourses.toLocaleString()}
          icon={<BookOpen size={24} />}
        />
        <StatCard
          label="평균 별점"
          value={`${stats.averageRating.toFixed(1)}★`}
          icon={<Star size={24} />}
        />
        <StatCard
          label="총 수강생"
          value={stats.totalStudents.toLocaleString()}
          icon={<Users size={24} />}
        />
        <StatCard
          label="주의 필요"
          value={stats.needsAttentionCount}
          icon={<AlertTriangle size={24} />}
          highlight={stats.needsAttentionCount > 0}
        />
      </div>

      {/* 필터 탭 */}
      <div className={styles.filterTabs}>
        <button
          className={`${styles.filterTab} ${filter === 'all' ? styles['filterTab--active'] : ''}`}
          onClick={() => setFilter('all')}
        >
          전체
          <span className={styles.filterCount}>{courses.length}</span>
        </button>
        <button
          className={`${styles.filterTab} ${filter === 'needs_attention' ? styles['filterTab--active'] : ''}`}
          onClick={() => setFilter('needs_attention')}
        >
          주의 필요
          <span className={`${styles.filterCount} ${styles['filterCount--warning']}`}>
            {courses.filter((c) => c.needsAttention).length}
          </span>
        </button>
      </div>

      {/* 강좌 테이블 */}
      <CourseTable courses={filteredCourses} onCourseClick={handleCourseClick} />

      {/* 강좌 상세 모달 */}
      <CourseDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        course={selectedCourse}
        isLoading={isLoadingDetail}
      />
    </div>
  );
};
