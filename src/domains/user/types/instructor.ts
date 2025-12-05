export type InstructorCourse = {
  id: string;
  title: string;
  category: string | string[] | null;
  thumbnailUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};