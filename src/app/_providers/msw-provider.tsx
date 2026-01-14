'use client';

import { Suspense, use } from 'react';
import { handlers } from '@/mocks/handlers';

declare global {
  interface ImportMeta {
    hot?: { dispose(cb: () => void): void };
  }
}
// TODO(mock): 환경변수로 mock 사용 여부 제어
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const mockingEnabledPromise =
  typeof window !== 'undefined' && USE_MOCK
    ? import('@/mocks/browser').then(async ({ default: worker }) => {
        await worker.start({
          onUnhandledRequest(request, print) {
            if (request.url.includes('_next')) return;
            print.warning();
          },
        });

        worker.use(...handlers);

        import.meta.hot?.dispose(() => {
          worker.stop();
        });

        console.log('[MSW] active handlers:', worker.listHandlers());
      })
    : Promise.resolve();

export const MSWProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  );
};

const MSWProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  use(mockingEnabledPromise);
  return children;
};
