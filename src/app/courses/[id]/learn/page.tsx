import CourseLearnClient from '@/domains/course/pages/CourseLearnClientPage';
import { guardLearnAccess } from '@/shared/guards/guardLearnAccess';

export default async function CourseLearnPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const enrollment = await guardLearnAccess(id);

  return <CourseLearnClient enrollmentId={enrollment.enrollmentId} />;
}
