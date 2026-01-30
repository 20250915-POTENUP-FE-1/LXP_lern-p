import type { Metadata } from 'next';
import './index.css';
import { cookies } from 'next/headers';
import { getUserProfile } from '@/domains/user/services/userService';
import { User } from '@/domains/user/types/user';
import { getCart } from '@/domains/cart/services/cartService';
import { MOCK_GET_CART } from '@/mocks/cart.mock';
import { USE_MOCK } from '@/shared/constants/config';
import { initMSW } from '@/mocks';
import { AuthProvider } from './_providers/AuthProvider';

if (process.env.NODE_ENV === 'development') {
  initMSW();
}

// if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV !== 'production') {
//   const { server } = await import('@/mocks/server');
//   server.listen();
// }

export const metadata: Metadata = {
  title: 'Lernix',
  description: '역할 전환형 온라인 학습 플랫폼',
};

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

async function fetchInitialCart(): Promise<string[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) return [];

  try {
    // TODO: API 정상화 후 제거 또는 MSW로 전환
    const cart = USE_MOCK ? MOCK_GET_CART : await getCart();
    const items = cart?.items ?? [];
    return items.map((it) => String(it.courseId));
  } catch {
    return [];
  }
}

async function fetchInitialUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  try {
    const userProfile = await getUserProfile();
    if (!userProfile) return null;

    const cartCourseIds = await fetchInitialCart().catch(() => []);

    const user: User = {
      id: userProfile.id,
      email: userProfile.email,
      nickname: userProfile.nickname,
      roles: userProfile.roles,
      cart: cartCourseIds,
      enrolledCourses: [],
      createdCourses: [],
      createdAt: new Date(userProfile.createdAt),
    };

    return user;
  } catch {
    // 만료/401은 정상 케이스
    return null;
  }
}
