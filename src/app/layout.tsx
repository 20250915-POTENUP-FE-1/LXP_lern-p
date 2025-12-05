import type { Metadata } from 'next';
import './index.css';
import { AppShell } from '@/shared/ui/AppShell';

export const metadata: Metadata = {
  title: 'LernP ',
  description: '역할 전환형 온라인 학습 플랫폼',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div id="root">
          <AppShell> {children}</AppShell>
        </div>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
