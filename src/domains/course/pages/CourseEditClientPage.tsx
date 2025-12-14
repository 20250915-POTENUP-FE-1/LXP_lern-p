'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import styles from '@/app/courses/create/CourseCreatePage.module.css';
import { SectionForm } from '@/domains/course/components/SectionForm';
import { CourseForm } from '../components/CourseForm';
import { useState } from 'react';
import { BLOCK_MESSAGES, useCourseEditGuard } from '../hooks/useCourseEditGuard';

export type BlockedReason = {
  icon: string;
  title: string;
  message: string;
  primaryLabel: string;
  secondaryLabel: string | null;
};

export default function CourseEditClientPage() {
  const searchParams = useSearchParams();
  const { id } = useParams<{ id: string }>();

  const courseId = typeof id === 'string' ? id : '';
  const currentStep = searchParams.get('step') || '1';

  const { checking, blocked, blockedReason } = useCourseEditGuard(courseId);

  // 잘못된 courseId 처리
  if (!courseId) {
    return (
      <section className={`${styles['course-create']} container`}>
        <div className={styles['course-create__header']}>
          <h1 className={styles['course-create__title']}>⚠️ 유효하지 않은 강좌 ID</h1>
        </div>
        <div className={styles['course-create__body']}>
          <p
            style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--color-text-muted)' }}
          >
            강좌 목록에서 다시 진입해 주세요.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/mypage/instructor" className={styles['course-create__submit-btn']}>
              내 강좌 목록으로 이동
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // status 확인 중
  if (checking) {
    return (
      <section className={`${styles['course-create']} container`}>
        <div className={styles['course-create__header']}>
          <h1 className={styles['course-create__title']}>⏳ 강좌 정보 확인 중...</h1>
        </div>
        <div className={styles['course-create__body']}>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            잠시만 기다려주세요.
          </p>
        </div>
      </section>
    );
  }

  // 차단 상태별 메시지
  if (blocked) {
    const currentMessage = BLOCK_MESSAGES[blockedReason];

    const primaryHref =
      blockedReason === 'published' ? `/courses/${courseId}` : '/mypage/instructor';

    return (
      <section className={`${styles['course-create']} container`}>
        <div className={styles['course-create__header']}>
          <h1 className={styles['course-create__title']}>
            {currentMessage.icon} {currentMessage.title}
          </h1>
        </div>
        <div className={styles['course-create__body']}>
          <p
            style={{
              textAlign: 'center',
              marginBottom: '32px',
              lineHeight: '1.6',
              color: 'var(--color-text-muted)',
            }}
          >
            {currentMessage.message}
          </p>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link href={primaryHref} className={styles['course-create__submit-btn']}>
              {currentMessage.primaryLabel}
            </Link>
            {currentMessage.secondaryLabel && (
              <Link href="/instructor/courses" className={styles['course-create__back-btn']}>
                {currentMessage.secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  const renderContent = () => {
    switch (currentStep) {
      case '1':
        return <CourseForm mode="edit" courseId={courseId} />;
      case '2':
        return <SectionForm mode="edit" courseId={courseId} />;
      default:
        return <CourseForm mode="edit" courseId={courseId} />;
    }
  };

  return (
    <section
      className={`${styles['course-create']} container`}
      aria-labelledby="course-create-title"
    >
      <header className={styles['course-create__header']}>
        <h1 id="course-create-title" className={styles['course-create__title']}>
          강좌 수정 (Step {currentStep})
        </h1>
      </header>
      <div className={styles['course-create__body']}>{renderContent()}</div>
    </section>
  );
}
