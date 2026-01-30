import { http, HttpResponse } from 'msw';
import { MOCK_GET_ENROLLMENT_BY_COURSEID } from '@/mocks/enrollmentList.mock';

export const getEnrollmentByCourseId = http.get('/api/enrollments/course/:courseId', () => {
  return HttpResponse.json(MOCK_GET_ENROLLMENT_BY_COURSEID, { status: 200 });
});
