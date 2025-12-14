import type { Metadata } from 'next';
import './index.css';
import { cookies } from 'next/headers';
import { getUserProfile } from '@/domains/user/services/userService';
import { User } from '@/domains/user/types/user';
import { MSWProvider } from './_providers/msw-provider';
import { AuthProvider } from './_providers/AuthProvider';

// if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV !== 'production') {
//   const { server } = await import('@/mocks/server');
//   server.listen();
// }

export const metadata: Metadata = {
  title: 'Learnix',
  description: '역할 전환형 온라인 학습 플랫폼',
};

async function fetchInitialUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  try {
    const userProfile = await getUserProfile();

    if (!userProfile) return null;

    const user: User = {
      id: userProfile.id,
      email: userProfile.email,
      nickname: userProfile.nickname,
      roles: userProfile.roles,
      cart: [],
      enrolledCourses: [],
      createdCourses: [],
      createdAt: new Date(userProfile.createdAt),
    };

    return user;
  } catch (e) {
    // 만료/401은 정상 케이스
    cookieStore.delete('accessToken');
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await fetchInitialUser();

  return (
    <html lang="ko">
      <body>
        <div id="root">
          {/* <MSWProvider>
            <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
          </MSWProvider> */}
          <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
        </div>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
