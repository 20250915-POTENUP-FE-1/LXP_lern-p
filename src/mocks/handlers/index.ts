import { getCourse } from '@/mocks/handlers/course';
import { getProgress, updateProgress } from '@/mocks/handlers/progress';
import { getEnrollmentByCourseId } from '@/mocks/handlers/enrollment';

export const handlers = [getCourse, getProgress, getEnrollmentByCourseId, updateProgress];
