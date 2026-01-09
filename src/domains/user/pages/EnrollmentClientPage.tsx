'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from '@/app/(user)/mypage/MyPageSections.module.css';
// TODO: 임시 목업 데이터
import { getEnrollmentList } from '@/domains/user/services/enrollmentService';
import type { EnrollmentListContent } from '@/domains/user/types/enrollment';
import { MOCK_ENROLLMENT_LIST } from '@/mocks/enrollmentList.mock';

export default function EnrollmentClientPage() {
  const [items, setItems] = useState<EnrollmentListContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledLoading, setEnrolledLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchEnrollments() {
      setEnrolledLoading(true);
      try {
        // TODO: 임시 목업 데이터
        // const page = await getEnrollmentList({
        //   status: 'ENROLLED',
        //   page: 0,
        //   size: 10,
        // });
        const page = MOCK_ENROLLMENT_LIST;

        setItems(page.content);
      } catch (e) {
        console.error('수강 목록 조회 실패:', e);
      } finally {
        setLoading(false);
        setEnrolledLoading(false);
      }
    }

    fetchEnrollments();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px' }}>⏳ 내 수강 강좌 불러오는 중...</div>;
  }

  if (items.length === 0) {
    return <div style={{ padding: '40px' }}>🫠 수강 중인 강의가 없어요.</div>;
  }

  return (
    <article className={styles['enrollment-section']} aria-labelledby="mypage-enrollment-title">
      <h1 id="mypage-enrollment-title" className={styles['enrollment-section__title']}>
        수강 중인 강좌
      </h1>

      <div className={styles['enrollment-section__list']}>
        {items.map((item) => (
          <div key={item.enrollmentId} className={styles['enrollment-card']}>
            <Link href={`/courses/${item.courseId}/learn`} className={styles['enrollment__link']}>
              <h3 className={styles['enrollment__title']}>{item.courseName}</h3>
              <p className={styles['enrollment__category']}>
                {item.categories?.join(' / ') ?? '카테고리 없음'}
              </p>
            </Link>

            <div className={styles['progress']} aria-label={`${item.progressRate ?? 0}%`}>
              <div
                className={styles['progress__bar']}
                style={{ width: `${item.progressRate ?? 0}%` }}
              />
            </div>

            <span
              className={styles['enrollment-card__percent']}
            >{`${item.progressRate ?? 0}%`}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
