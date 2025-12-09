export type EnrollmentStatus = 'ENROLLED' | 'COMPLETED' | 'CANCELED' | 'EXPIRED';

export type EnrolledCourse = {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number;
  createdAt: string | null;
  updatedAt: string | null;
  course: {
    id: string;
    title: string;
    category: string | string[];
    thumbnailUrl: string | null;
  } | null;
};
