import { Link } from 'react-router';
import styles from './CourseCard.module.css';

export function CourseCard({ course }) {
  // 카테고리 문자열로 변환 (배열 → " > " 구분자)
  const categoryPath = Array.isArray(course.category)
    ? course.category.join(' > ')
    : course.category;

  return (
    <Link
      to={`/courses/${course.id}`}
      className={styles['course-card']}
      aria-label={`${course.title} 상세 보기`}
    >
      <div className={styles['course-card__thumb-wrapper']}>
        <img
          className={styles['course-card__thumb']}
          src={course.thumbnail}
          alt={`${course.title} 썸네일`}
          loading="lazy"
        />
      </div>

      <div className={styles['course-card__body']}>
        <h3 className={styles['course-card__title']}>{course.title}</h3>

        {/* 강사명 + 카테고리 경로 */}
        <p className={styles['course-card__meta']}>
          <span className={styles['course-card__instructor']}>{course.instructorName}</span>
          {categoryPath && <span className={styles['course-card__category']}>{categoryPath}</span>}
        </p>

        {course.summary && <p className={styles['course-card__summary']}>{course.summary}</p>}

        {course.tags?.length > 0 && (
          <ul className={styles['course-card__tags']}>
            {course.tags.map((tag) => (
              <li
                key={tag}
                className={`${styles['course-card__tag']} ${styles['course-card__tag--category']}`}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className={styles['course-card__foot']}>
          <span className={styles['course-card__price']}>
            {course.isFree ? '무료' : `₩${course.price.toLocaleString()}`}
          </span>
          {
            <span className={styles['course-card__students']}>
              👥 {course.studentCount.toLocaleString()}
            </span>
          }
        </div>
      </div>
    </Link>
  );
}
