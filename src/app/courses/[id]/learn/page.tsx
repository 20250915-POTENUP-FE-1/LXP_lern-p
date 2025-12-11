import CourseLearnClient from '@/domains/course/pages/CourseLearnClientPage';

export default async function CourseLearnPage({ params }: { params: { id: string } }) {
  return <CourseLearnClient />;
}
