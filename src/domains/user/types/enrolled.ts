export type EnrolledCourse = {
  id: string;
  userId: string;
  courseId: string;
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