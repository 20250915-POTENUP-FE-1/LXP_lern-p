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
    ? import('@/mocks/browser').then(async ({ default: worker }) => {
        if (process.env.NODE_ENV === 'production') {
          return;
        }
        await worker.start({
          onUnhandledRequest(request, print) {
            if (request.url.includes('_next')) {
              return;
            }
            print.warning();
          },
        });
        worker.use(...handlers);

        import.meta.hot?.dispose(() => {
          worker.stop();
        });
        console.log(worker.listHandlers());
      })
    : Promise.resolve();

export const MSWProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  );
};

const MSWProviderWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  use(mockingEnabledPromise);
  return children;
};
