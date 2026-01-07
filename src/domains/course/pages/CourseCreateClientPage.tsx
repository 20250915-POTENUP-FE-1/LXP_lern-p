'use client';

import { useSearchParams } from 'next/navigation';
import styles from '@/app/courses/create/CourseCreatePage.module.css';
import { SectionForm } from '@/domains/course/components/SectionForm';
import { CourseForm } from '../components/CourseForm';

export default function CourseCreateClientPage() {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get('step') || '1';
  const stepNumber = Number(currentStep);

  const getStepClass = (step: number) => {
    if (stepNumber === step) return styles['course-create__step--active'];
    if (stepNumber > step) return styles['course-create__step--complete'];
    return '';
  };

  const renderContent = () => {
    switch (currentStep) {
      case '1':
        return <CourseForm />;
      case '2':
        return <SectionForm />;
      default:
        return <CourseForm />;
    }
  };
  return (
    <section
      className={`${styles['course-create']} container`}
      aria-labelledby="course-create-title"
    >
      <header className={styles['course-create__header']}>
        <div className={styles['course-create__heading']}>
          <h1 id="course-create-title" className={styles['course-create__title']}>
            강좌 등록
          </h1>
          <p className={styles['course-create__subtitle']}>
            강좌 기본 정보와 커리큘럼을 순서대로 입력해 주세요.
          </p>
        </div>
        <ol className={styles['course-create__steps']} aria-label="강좌 등록 단계">
          <li
            className={`${styles['course-create__step']} ${getStepClass(1)}`}
            aria-current={stepNumber === 1 ? 'step' : undefined}
          >
            <span className={styles['course-create__step-number']}>1</span>
            <span className={styles['course-create__step-text']}>기본 정보</span>
          </li>
          <li
            className={`${styles['course-create__step']} ${getStepClass(2)}`}
            aria-current={stepNumber === 2 ? 'step' : undefined}
          >
            <span className={styles['course-create__step-number']}>2</span>
            <span className={styles['course-create__step-text']}>섹션 구성</span>
          </li>
        </ol>
      </header>
      <div className={styles['course-create__body']}>{renderContent()}</div>
    </section>
  );
}
