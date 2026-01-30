import { http, HttpResponse } from 'msw';
import { MOCK_LEARN_COURSE_MAP } from '@/mocks/learn.mock';

export const getCourse = http.get('/api/courses/:courseId', ({ params }) => {
  const { courseId } = params;

  const course = MOCK_LEARN_COURSE_MAP[String(courseId)];

  if (!course) {
    return HttpResponse.json({ message: 'Course not found' }, { status: 404 });
  }

  return HttpResponse.json(course, { status: 200 });
});
