import { RequireInstructor } from '@/shared/guards/RequireInstructor';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return <RequireInstructor>{children}</RequireInstructor>;
}
