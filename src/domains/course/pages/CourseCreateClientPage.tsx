'use client';

import { useParams, useSearchParams } from 'next/navigation';
import styles from '@/app/courses/create/CourseCreatePage.module.css';
import { SectionForm } from '@/domains/course/components/SectionForm';
import { CourseForm } from '../components/CourseForm';

export default function CourseCreateClientPage() {
  const searchParams = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const courseId = id;
  const isEditMode = Boolean(courseId);
  const currentStep = searchParams.get('step') || '1';

  const renderContent = () => {
    switch (currentStep) {
      case '1':
        return <CourseForm mode="create" />;
      case '2':
        return <SectionForm mode="create" />;
      default:
        return <CourseForm mode="create" />;
    }
  };
  return (
    <section
      className={`${styles['course-create']} container`}
      aria-labelledby="course-create-title"
    >
      <header className={styles['course-create__header']}>
        <h1 id="course-create-title" className={styles['course-create__title']}>
          {isEditMode ? '강좌 수정' : '강좌 등록'} (Step {currentStep})
        </h1>
      </header>
      <div className={styles['course-create__body']}>{renderContent()}</div>
    </section>
  );
}
