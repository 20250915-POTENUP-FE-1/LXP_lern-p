import type { Course } from '@/domains/course/types/course';
import { Enrollment } from './enrollment';

export type EnrolledCourse = Enrollment & {
  course: Pick<Course, 'id' | 'title' | 'category' | 'thumbnailUrl'> | null;
};
