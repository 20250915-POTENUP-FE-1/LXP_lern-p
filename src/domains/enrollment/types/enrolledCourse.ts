import type { Enrollment } from './enrollment';
import type { Course } from '@/domains/course/types/course';

export type EnrolledCourse = Enrollment & {
  course: Pick<Course, 'id' | 'title' | 'category' | 'thumbnailUrl'> | null;
};
