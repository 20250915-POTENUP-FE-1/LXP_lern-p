import CourseDetailClientPage from '@/domains/course/pages/CourseDetailClientPage';

type PageProps = {
  params: { id: string };
};

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <CourseDetailClientPage />;
}
