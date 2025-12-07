import styles from './CourseCreatePage.module.css';
import { CourseForm } from '@/domains/course/components/CourseForm';

export default function CourseCreatePage() {
  return (
    <section
      className={`${styles['course-create']} container`}
      aria-labelledby="course-create-title"
    >
      <header className={styles['course-create__header']}>
        <h1 id="course-create-title" className={styles['course-create__title']}>
          강좌 등록
        </h1>
      </header>

      <div className={styles['course-create__body']}>
        <CourseForm />
      </div>
    </section>
  );
}
