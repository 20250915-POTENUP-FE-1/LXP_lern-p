export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  status: 'ENROLLED' | 'COMPLETED';
  createdAt: string;
};

export type EnrolledCourse = {
  enrollmentId: string;
  courseId: string;
  title: string;
  thumbnailUrl: string;
  progress: number;
};

export type Progress = {
  lectureId: string;
  completed: boolean;
  completedAt?: string;
};
