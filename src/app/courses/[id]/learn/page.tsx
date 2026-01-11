import CourseLearnClient from '@/domains/course/pages/CourseLearnClientPage';
import { requireLearn } from '@/shared/guards/RequireLearn';

export default async function CourseLearnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params;
  const enrollment = await requireLearn(courseId);

  return <CourseLearnClient enrollmentId={enrollment.enrollmentId} />;
}
