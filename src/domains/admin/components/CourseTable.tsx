'use client';

import { AlertTriangle, Star, Users } from 'lucide-react';
import type { AdminCourseItem, ReviewSentiment } from '../types/admin';
import styles from './CourseTable.module.css';

type CourseTableProps = {
  courses: AdminCourseItem[];
  onCourseClick: (courseId: string) => void;
};

const getSentimentLabel = (sentiment: ReviewSentiment) => {
  switch (sentiment) {
    case 'POSITIVE':
      return { text: '긍정적', className: styles['sentiment--positive'] };
    case 'NEUTRAL':
      return { text: '중립', className: styles['sentiment--neutral'] };
    case 'NEGATIVE':
      return { text: '부정적', className: styles['sentiment--negative'] };
  }
};

export const CourseTable = ({ courses, onCourseClick }: CourseTableProps) => {
  if (courses.length === 0) {
    return (
      <div className={styles.empty}>
        <p>표시할 강좌가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>강좌명</th>
            <th className={styles.th}>강사</th>
            <th className={styles.th}>별점</th>
            <th className={styles.th}>수강생</th>
            <th className={styles.th}>AI 요약</th>
            <th className={styles.th}>주의 필요</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            const sentiment = getSentimentLabel(course.aiSummary.sentiment);
            return (
              <tr
                key={course.courseId}
                className={styles.tr}
                onClick={() => onCourseClick(course.courseId)}
              >
                <td className={styles.td}>
                  <div className={styles.titleCell}>
                    <span className={styles.title}>{course.title}</span>
                    <span className={styles.category}>
                      {course.categories.join(' > ')}
                    </span>
                  </div>
                </td>
                <td className={styles.td}>{course.instructorName}</td>
                <td className={styles.td}>
                  <div className={styles.rating}>
                    <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.students}>
                    <Users size={16} />
                    <span>{course.studentCount.toLocaleString()}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.sentiment} ${sentiment.className}`}>
                    {sentiment.text}
                  </span>
                </td>
                <td className={styles.td}>
                  {course.needsAttention ? (
                    <div className={styles.attention}>
                      <AlertTriangle size={18} />
                    </div>
                  ) : (
                    <span className={styles.normal}>-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
