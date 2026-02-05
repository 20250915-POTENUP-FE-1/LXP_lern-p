'use client';

import { ExternalLink, Mail, Star, Users, MessageSquare, X } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import type { AdminCourseDetail } from '../types/admin';
import { RatingDistribution } from './RatingDistribution';
import styles from './CourseDetailModal.module.css';

type CourseDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  course: AdminCourseDetail | null;
  isLoading?: boolean;
};

export const CourseDetailModal = ({
  isOpen,
  onClose,
  course,
  isLoading = false,
}: CourseDetailModalProps) => {
  if (!isOpen) return null;

  const handleViewDetail = () => {
    if (course) {
      window.open(`/courses/${course.courseId}`, '_blank');
    }
  };

  const handleNotifyInstructor = () => {
    // TODO: 강사 알림 기능 구현
    alert('강사에게 알림을 보냈습니다.');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>{course?.title ?? '로딩 중...'}</h2>
            {course && (
              <div className={styles.meta}>
                <span>강사: {course.instructorName}</span>
                <span className={styles.divider}>|</span>
                <span>카테고리: {course.categories.join(' > ')}</span>
              </div>
            )}
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loading}>
            <p>강좌 정보를 불러오는 중...</p>
          </div>
        ) : course ? (
          <>
            {/* 핵심 지표 */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>핵심 지표</h3>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <Star size={20} fill="#fbbf24" stroke="#fbbf24" />
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{course.rating.toFixed(1)}</span>
                    <span className={styles.statLabel}>평균 별점</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <Users size={20} />
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>
                      {course.studentCount.toLocaleString()}
                    </span>
                    <span className={styles.statLabel}>수강생 수</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <MessageSquare size={20} />
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>
                      {course.reviewCount.toLocaleString()}
                    </span>
                    <span className={styles.statLabel}>리뷰 수</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 별점 분포 */}
            <div className={styles.section}>
              <RatingDistribution distribution={course.ratingDistribution} />
            </div>

            {/* AI 리뷰 요약 */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>AI 리뷰 요약</h3>
              <div className={styles.aiSummary}>
                <div className={styles.summaryItem}>
                  <span className={`${styles.summaryLabel} ${styles['summaryLabel--positive']}`}>
                    긍정적 의견
                  </span>
                  <p className={styles.summaryText}>{course.aiSummary.positive}</p>
                </div>
                <div className={styles.summaryItem}>
                  <span className={`${styles.summaryLabel} ${styles['summaryLabel--negative']}`}>
                    부정적 의견
                  </span>
                  <p className={styles.summaryText}>{course.aiSummary.negative}</p>
                </div>
                <div className={styles.summaryItem}>
                  <span className={`${styles.summaryLabel} ${styles['summaryLabel--suggestion']}`}>
                    개선 제안
                  </span>
                  <p className={styles.summaryText}>{course.aiSummary.suggestion}</p>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className={styles.actions}>
              <button className={styles.buttonSecondary} onClick={handleViewDetail}>
                <ExternalLink size={16} />
                강좌 상세 페이지로 이동
              </button>
              <button className={styles.buttonPrimary} onClick={handleNotifyInstructor}>
                <Mail size={16} />
                강사에게 알림 보내기
              </button>
            </div>
          </>
        ) : (
          <div className={styles.error}>
            <p>강좌 정보를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
