import layout from '@/domains/user/pages/MyPage.module.css';
import MyPageSidebar from '@/domains/user/components/MyPageSidebar';
import { AppShell } from '@/shared/ui/AppShell';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <section className={`${layout['mypage']} container`} aria-label="마이페이지">
        <div className={layout['mypage__layout']}>
          <aside className={layout['mypage__sidebar']}>
            <MyPageSidebar />
          </aside>
          <div className={layout['mypage__content']}>
            {children}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
