'use client';

import { useEffect, useState } from 'react';
import { getUserProfile } from '@/domains/user/services/userService'; // Spring Boot API 호출로 사용자 프로필 가져오기
import type { User } from '@/domains/user/types/user';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null); // User 타입으로 초기화
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(); // 받아온 UserResponse

        if (userProfile) {
          const userData: User = {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.nickname, // UserResponse의 nickname을 User의 name으로 매핑
            roles: userProfile.roles,
            cart: [], // 초기값 빈 배열로 설정
            enrolledCourses: [], // 초기값 빈 배열로 설정
            createdCourses: [], // 초기값 빈 배열로 설정
            createdAt: new Date(userProfile.createdAt), // UserResponse의 createdAt을 Date로 변환
          };

          setUser(userData); // 변환된 User 객체로 상태 업데이트
        }

        setInitialized(true);
      } catch (error) {
        console.error('사용자 프로필 조회에 실패하였습니다', error);
        setInitialized(true);
      }
    };

    fetchUserProfile();
  }, []);

  return { user, loading: !initialized, initialized };
};
