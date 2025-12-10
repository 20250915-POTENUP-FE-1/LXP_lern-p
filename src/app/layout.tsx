import type { Metadata } from 'next';
import './index.css';
import { getUserProfile } from '@/domains/user/services/userService';
import { User } from '@/domains/user/types/user';
import { AuthProvider } from './_providers/AuthProvider';

export const metadata: Metadata = {
  title: 'LernP ',
  description: '역할 전환형 온라인 학습 플랫폼',
};

async function fetchInitialUser(): Promise<User | null> {
  try {
    const userProfile = await getUserProfile(); // 서버 전용: fetchApi 사용

    if (!userProfile) return null;

    const user: User = {
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.nickname,
      roles: userProfile.roles,
      cart: [],
      enrolledCourses: [],
      createdCourses: [],
      createdAt: new Date(userProfile.createdAt),
    };

    return user;
  } catch (e) {
    // 로그인 안 되어 있거나 에러 나면 null
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await fetchInitialUser();

  return (
    <html lang="ko">
      <body>
        <div id="root">
          <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
        </div>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
