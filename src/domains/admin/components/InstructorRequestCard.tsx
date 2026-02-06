// 승인 거절 후 결과 표시 카드

'use client';

import { User, Mail, Calendar } from 'lucide-react';
import type { InstructorRequest } from '../types/admin';
import styles from './InstructorRequestCard.module.css';

type InstructorRequestCardProps = {
  request: InstructorRequest;
  onClick: () => void;
};

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const InstructorRequestCard = ({ request, onClick }: InstructorRequestCardProps) => {
  return (
    <button className={styles.card} onClick={onClick} type="button">
      <div className={styles.avatar}>
        <User size={24} />
      </div>
      <div className={styles.content}>
        <div className={styles.nickname}>{request.nickname}</div>
        <div className={styles.info}>
          <span className={styles.infoItem}>
            <Mail size={14} />
            {request.email}
          </span>
          <span className={styles.infoItem}>
            <Calendar size={14} />
            신청일: {formatDate(request.requestedAt)}
          </span>
        </div>
      </div>
      {request.status === 'PENDING' && <span className={styles.badge}>대기중</span>}
      {request.status === 'APPROVED' && (
        <span className={`${styles.badge} ${styles['badge--approved']}`}>승인됨</span>
      )}
      {request.status === 'REJECTED' && (
        <span className={`${styles.badge} ${styles['badge--rejected']}`}>거절됨</span>
      )}
    </button>
  );
};
