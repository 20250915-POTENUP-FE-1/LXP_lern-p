import CourseLearnClient from '@/domains/course/pages/CourseLearnClientPage';
import { requireLearn } from '@/shared/guards/RequireLearn';

export default async function CourseLearnPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const enrollment = await requireLearn(id);

  return <CourseLearnClient enrollmentId={enrollment.enrollmentId} />;
}
