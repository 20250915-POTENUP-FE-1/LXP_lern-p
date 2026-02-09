'use client';

import { User, Mail, Calendar } from 'lucide-react';
import { formatDate } from '@/shared/util/formatDate';
import type { InstructorRequest } from '../types/admin';
import styles from './InstructorRequestCard.module.css';

type InstructorRequestCardProps = {
  request: InstructorRequest;
  onClick: () => void;
};

export const InstructorRequestCard = ({ request, onClick }: InstructorRequestCardProps) => {
  return (
    <button className={styles['instructor-request-card']} onClick={onClick} type="button">
      <div className={styles['instructor-request-card__avatar']}>
        <User size={24} />
      </div>
      <div className={styles['instructor-request-card__content']}>
        <div className={styles['instructor-request-card__nickname']}>{request.nickname}</div>
        <div className={styles['instructor-request-card__info']}>
          <span className={styles['instructor-request-card__info-item']}>
            <Mail size={14} />
            {request.email}
          </span>
          <span className={styles['instructor-request-card__info-item']}>
            <Calendar size={14} />
            신청일: {formatDate(request.requestedAt)}
          </span>
        </div>
      </div>
      {request.status === 'PENDING' && (
        <span className={styles['instructor-request-card__badge']}>대기중</span>
      )}
      {request.status === 'APPROVED' && (
        <span
          className={`${styles['instructor-request-card__badge']} ${styles['instructor-request-card__badge--approved']}`}
        >
          승인됨
        </span>
      )}
      {request.status === 'REJECTED' && (
        <span
          className={`${styles['instructor-request-card__badge']} ${styles['instructor-request-card__badge--rejected']}`}
        >
          거절됨
        </span>
      )}
    </button>
  );
};
