'use client';

import { useParams, useSearchParams } from 'next/navigation';
import styles from '@/app/courses/create/CourseCreatePage.module.css';
import { SectionForm } from '@/domains/course/components/SectionForm';
import { CourseForm } from '../components/CourseForm';
import { useEffect, useState } from 'react';
import { getCourse } from '../services/courseService';
import { useRouter } from 'next/navigation';

export default function CourseEditClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const courseId = id;

  const currentStep = searchParams.get('step') || '1';

  const [checking, setChecking] = useState(true);
  const [blocked, setBlocked] = useState(false);

  if (!courseId || typeof courseId !== 'string') {
    return (
      <section className="container">
        <p>유효하지 않은 강좌 ID입니다. 목록에서 다시 진입해 주세요.</p>
      </section>
    );
  }

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { course } = await getCourse(courseId);
        if (!course) {
          setBlocked(true);
          return;
        }

        if (course.status !== 'draft') {
          setBlocked(true);
        }
      } catch (err) {
        console.error('[CourseEditClientPage] status check 실패:', err);
        setBlocked(true);
      } finally {
        setChecking(false);
      }
    };

    void checkStatus();
  }, [courseId]);

  // status 확인 중
  if (checking) {
    return (
      <section className="container">
        <p>강좌 정보를 확인하는 중입니다...</p>
      </section>
    );
  }

  // draft 이외(status: published / hidden / undefined 등)는 진입 차단
  if (blocked) {
    return (
      <section className="container">
        <p>이미 발행되었거나 수정이 불가능한 강좌입니다.</p>
        <button
          type="button"
          onClick={() => router.push(`/courses/${courseId}`)}
          className={styles['course-create__back-btn']}
        >
          강좌 상세 페이지로 이동
        </button>
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
