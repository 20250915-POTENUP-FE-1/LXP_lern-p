import Image from 'next/image';
import { Link } from 'react-router';
import styles from './CourseCard.module.css';

export function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className={styles['course-card']}
      aria-label={`${course.title} 상세 보기`}
    >
      <div className={styles['course-card__thumb-wrapper']}>
        <Image
          className={styles['course-card__thumb']}
          src={course.thumbnailUrl}
          alt={`${course.title} 썸네일`}
          loading="lazy"
        />
      </div>

      <div className={styles['course-card__body']}>
        <div>
          <h3 className={styles['course-card__title']}>{course.title}</h3>
        </div>

        <div className={`${styles['course-card__meta']} ${styles['course-card__instructor']}`}>
          {course.instructorName}
        </div>

        {course.summary && <p className={styles['course-card__summary']}>{course.summary}</p>}

        {course.tags?.length > 0 && (
          <ul className={styles['course-card__tags']}>
            {course.tags.map((tag, index) => (
              <li
                key={index}
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
          {/* <span className={styles['course-card__students']}>
             {course.studentCount.toLocaleString()}
          </span> */}
        </div>
      </div>
    </Link>
  );
}
