import { RequireInstructor } from '@/shared/guards/RequireInstructor';

export default function CourseCreateLayout({ children }: { children: React.ReactNode }) {
  return <RequireInstructor>{children}</RequireInstructor>;
}
