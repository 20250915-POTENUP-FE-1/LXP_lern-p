'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import styles from '@/app/(user)/mypage/MyPageSections.module.css';
import { formatUserDate } from '@/domains/user/utils/formatUserDate';
import { useAuthState } from '@/domains/auth/hooks/useAuthState';
import { useEffect, useState } from 'react';
import { updateMyProfile } from '../services/userService';

export default function ProfilePage() {
  const { user, setUser, loading } = useAuthState();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.nickname) {
      setNickname(user.nickname);
    }
  }, [user?.nickname]);

  async function handleSave() {
    if (!nickname.trim() || !user) return;

    try {
      setIsSaving(true);

      await updateMyProfile({ nickname });

      setUser({
        ...user,
        nickname,
      });

      setIsEditing(false);
    } catch (e) {
      console.error('프로필 수정 실패', e);
      alert('닉네임 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }

  if (loading || !user) return null;

  return (
    <article className={styles['profile-section']} aria-labelledby="mypage-profile-title">
      <div className={styles['profile-section__header']}>
        <h1 id="mypage-profile-title" className={styles['profile-section__title']}>
          내 정보
        </h1>
      </div>

      {/* 프로필 헤더 카드 */}
      <section className={styles['profile-section__header-card']} aria-label="프로필 요약">
        <div className={styles['profile-section__avatar']} aria-hidden="true">
          <User className={styles['profile-section__icon']} />
        </div>

        <div className={styles['profile-section__identity']}>
          <h2 className={styles['profile-section__name']}>
            {isEditing ? (
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={styles['profile-section__input']}
                autoFocus
              />
            ) : (
              <span>{user.nickname}님</span>
            )}

            <button
              type="button"
              className={`${styles['profile__btn']} ${styles['profile__btn--edit']}`}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={isSaving}
            >
              {isEditing ? '저장' : '수정'}
            </button>
          </h2>
          <p className={styles['profile-section__email']}>{user.email}</p>
          <p className={styles['profile-section__since']}>
            가입일: {formatUserDate(user.createdAt)}
          </p>
        </div>
      </section>

      {/* 상세 정보 카드 */}
      <div className={styles['profile-section__card']}>
        <div className={styles['profile-section__row']}>
          <span className={styles['profile-section__label']}>이름</span>
          <span className={styles['profile-section__value']}>{user.nickname}님</span>
        </div>

        <div className={styles['profile-section__divider']} />

        <div className={styles['profile-section__row']}>
          <span className={styles['profile-section__label']}>이메일</span>
          <span className={styles['profile-section__value']}>{user.email}</span>
        </div>

        <div className={styles['profile-section__divider']} />

        <div className={styles['profile-section__row']}>
          <span className={styles['profile-section__label']}>가입일</span>
          <span className={styles['profile-section__value']}>{formatUserDate(user.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
