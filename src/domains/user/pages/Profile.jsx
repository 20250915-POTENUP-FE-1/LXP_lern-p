import styles from '@/domains/user/pages/MyPageSections.module.css';
import { formatUserDate } from "@/domains/user/utils/formatUserDate";
import { User } from "lucide-react";
import { NavLink } from 'react-router';
import { useAuthState } from '../../auth/hooks/useAuthState';


export default function Profile() {
  const { user, loading } = useAuthState();

  if (loading) return null;

  return (
    <article className={styles['profile-section']} aria-labelledby="mypage-profile-title">
      <div className={styles['profile-section__header']}>
        <h1 id="mypage-profile-title" className={styles['profile-section__title']}>
          내 정보
        </h1>
        <div className={styles['profile__actions']}>
          <NavLink
            to="/mypage"
            className={`${styles['profile__btn']} ${styles['profile__btn--edit']}`}
          >
            정보 수정
          </NavLink>
        </div>
      </div>

      {/* 프로필 헤더 카드 */}
      <section className={styles['profile-section__header-card']} aria-label="프로필 요약">
        <div className={styles['profile-section__avatar']} aria-hidden="true" >
          <User className={styles['profile-section__icon']} />
        </div>
        <div className={styles['profile-section__identity']}>
          <h2 className={styles['profile-section__name']}>{user.name}님</h2>
          <p className={styles['profile-section__email']}>{user.email}</p>
          <p className={styles['profile-section__since']}>가입일: {formatUserDate(user.createdAt)}</p>
        </div>
      </section>

      {/* 상세 정보 카드 */}
      <div className={styles['profile-section__card']}>
        <div className={styles['profile-section__row']}>
          <span className={styles['profile-section__label']}>이름</span>
          <span className={styles['profile-section__value']}>{user.name}</span>
        </div>
        <div className={styles['profile-section__divider']} aria-hidden="true" />
        <div className={styles['profile-section__row']}>
          <span className={styles['profile-section__label']}>이메일</span>
          <span className={styles['profile-section__value']}>{user.email}</span>
        </div>
        <div className={styles['profile-section__divider']} aria-hidden="true" />
        <div className={styles['profile-section__row']}>
          <span className={styles['profile-section__label']}>가입일</span>
          <span className={styles['profile-section__value']}>{formatUserDate(user.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
