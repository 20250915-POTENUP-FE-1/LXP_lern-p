export type InstructorCourse = {
  courseId: string;
  title: string;
  categories: string[];
  thumbnailUrl: string;
  status: 'PUBLISHED' | 'DRAFT';
  price: number;
  studentCount: number;
  rating: number;
  lastModifiedAt: string;
};

export type InstructorCoursePage = {
  content: InstructorCourse[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};
