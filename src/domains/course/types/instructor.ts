export type InstructorCourseListItemResponse = {
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

export type InstructorCourseListResponse = {
  content: InstructorCourseListItemResponse[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};
