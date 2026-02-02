'use client';

import { Suspense, use } from 'react';
import { handlers } from '@/mocks/handlers';

declare global {
  interface ImportMeta {
    hot?: { dispose(cb: () => void): void };
  }
}
const mockingEnabledPromise =
  typeof window !== 'undefined'
    ? import('@/mocks/browser').then(async ({ worker }) => {
        if (process.env.NODE_ENV === 'production') {
          return;
        }
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

export const MSWProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  use(mockingEnabledPromise);
  return children;
};
