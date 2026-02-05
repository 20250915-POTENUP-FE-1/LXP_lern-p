'use client';

import { Star } from 'lucide-react';
import type { RatingDistribution as RatingDistributionType } from '../types/admin';
import styles from './RatingDistribution.module.css';

type RatingDistributionProps = {
  distribution: RatingDistributionType[];
};

export const RatingDistribution = ({ distribution }: RatingDistributionProps) => {
  // 5점부터 1점 순으로 정렬
  const sortedDistribution = [...distribution].sort((a, b) => b.rating - a.rating);

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>별점 분포</h4>
      <div className={styles.bars}>
        {sortedDistribution.map((item) => (
          <div key={item.rating} className={styles.row}>
            <div className={styles.label}>
              <span>{item.rating}</span>
              <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
            </div>
            <div className={styles.barWrapper}>
              <div
                className={styles.bar}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className={styles.percentage}>{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
