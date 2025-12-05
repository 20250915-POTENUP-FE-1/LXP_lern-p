import layout from '@/domains/user/pages/MyPage.module.css';
import MyPageSidebar from '@/domains/user/components/MyPageSidebar';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
