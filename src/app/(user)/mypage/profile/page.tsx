'use client'

import { User } from 'lucide-react';
import Link from "next/link";
import styles from '@/domains/user/pages/MyPageSections.module.css';
import { formatUserDate } from '@/domains/user/utils/formatUserDate';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';

export default function Profile() {
  const { user, loading } = useAuthState();

    // 🟨 ⭐ 임시 로그인 user 주입 (나중에 이 한 줄만 지우면 끝!)
  const mockUser = { id: "u123", name: "김오리", email: "duck@example.com", createdAt: "2025-01-01" };
  const _user = user ?? mockUser; // ← 지울 줄: 이 한 줄만 삭제하면 기존 구조 그대로

  if (loading || !_user) return null;

  return (
    <article className={styles['profile-section']} aria-labelledby="mypage-profile-title">
      <div className={styles['profile-section__header']}>
        <h1 id="mypage-profile-title" className={styles['profile-section__title']}>
          내 정보
        </h1>

        <div className={styles['profile__actions']}>
          <Link
            href="/mypage/profile/edit"
            className={`${styles['profile__btn']} ${styles['profile__btn--edit']}`}
          >
            정보 수정
          </Link>
        </div>
      </div>

      {/* 프로필 헤더 카드 */}
      <section className={styles['profile-section__header-card']} aria-label="프로필 요약">
        <div className={styles['profile-section__avatar']} aria-hidden="true">
          <User className={styles['profile-section__icon']} />
        </div>

        <div className={styles['profile-section__identity']}>
          <h2 className={styles['profile-section__name']}>{_user.name}님</h2>
          <p className={styles['profile-section__email']}>{_user.email}</p>
          <p className={styles['profile-section__since']}>
            가입일: {formatUserDate(_user.createdAt)}
          </p>
        </div>
      </section>

      {/* 상세 정보 카드 */}
      <div className={styles['profile-section__card']}>
        <div className={styles['profile-section__row']}>
          <span className={styles['profile-section__label']}>이름</span>
          <span className={styles['profile-section__value']}>{_user.name}</span>
        </div>

        <div className={styles['profile-section__divider']} />

        <div className={styles['profile-section__row']}>
          <span className={styles['profile-section__label']}>이메일</span>
          <span className={styles['profile-section__value']}>{_user.email}</span>
        </div>

        <div className={styles['profile-section__divider']} />

        <div className={styles['profile-section__row']}>
          <span className={styles['profile-section__label']}>가입일</span>
          <span className={styles['profile-section__value']}>
            {formatUserDate(_user.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
