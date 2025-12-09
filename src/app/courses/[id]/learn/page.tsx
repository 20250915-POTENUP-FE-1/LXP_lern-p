import CourseLearnClient from '@/domains/course/pages/CourseLearnClientPage';
import { getLearnPageData } from '@/domains/course/services/learnService';

type LearnPageProps = {
  params: { id: string };
};

export default async function CourseLearnPage({ params }: LearnPageProps) {
  const { id } = params;
  const learnData = await getLearnPageData(id);

  return <CourseLearnClient learnData={learnData} />;
}
