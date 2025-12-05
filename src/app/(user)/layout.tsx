import { RequireAuth } from '@/shared/guards/RequireAuth';
import { AppShell } from '@/shared/ui/AppShell';

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <RequireAuth>{children}</RequireAuth>
    </AppShell>
  );
}
