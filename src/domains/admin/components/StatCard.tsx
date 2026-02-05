'use client';

import type { ReactNode } from 'react';
import styles from './StatCard.module.css';

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  highlight?: boolean;
};

export const StatCard = ({ label, value, icon, highlight = false }: StatCardProps) => {
  return (
    <div className={`${styles.card} ${highlight ? styles['card--highlight'] : ''}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
};
