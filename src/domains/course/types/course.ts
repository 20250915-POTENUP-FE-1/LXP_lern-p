export type Course = {
  id: string;
  title: string;
  summary: string;
  description: string;
  thumbnailUrl: string;

  instructorId: string;
  instructorName: string;

  category: string[];
  level: string;
  tags: string[];

  price: number;
  isFree: boolean;

  studentCount: number;

  duration: number;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

  createdAt: string;
  updatedAt: string;

  sections: string[];
};

export type Section = {
  id: string;
  courseId: string;
  title: string;
  sequence: number;
  lectures: string[];
  createdAt: string;
  updatedAt: string;
};

export type Lecture = {
  id: string;
  sectionId: string;
  courseId: string;
  title: string;
  videoUrl: string;
  duration: number;
  sequence: number;
  createdAt: string;
  updatedAt: string;
};

export type CourseDetailResponse = {
  course: Course | null;
  sections: Section[];
  lectures: Record<string, Lecture[]>;
};

/** 요청 DTO 쪽 네이밍 */
export type CreateLectureRequest = {
  title: string;
  videoUrl?: string;
  duration: number;
};

export type CreateSectionRequest = {
  title: string;
  lectures: CreateLectureRequest[];
};

export type CreateCourseRequest = {
  title: string;
  summary: string;
  description: string;
  thumbnailUrl: string;
  category: string[];
  level: string;
  price: number | string;
};
