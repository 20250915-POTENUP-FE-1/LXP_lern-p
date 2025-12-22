import CourseLearnClient from '@/domains/course/pages/CourseLearnClientPage';
import { guardLearnAccess } from '@/shared/guards/guardLearnAccess';

export default async function CourseLearnPage({ params }: { params: { id: string } }) {
  const enrollment = await guardLearnAccess(params.id);

  return <CourseLearnClient enrollmentId={enrollment.enrollmentId} />;
}
