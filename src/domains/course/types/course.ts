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
  status: 'draft' | 'published' | 'hidden';

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

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  enrolledAt: string;
};

export type CourseDetailResponse = {
  course: Course | null;
  sections: Section[];
  lectures: Record<string, Lecture[]>;
};

export type CreateLectureInput = {
  title: string;
  videoUrl?: string;
  duration: number;
};

export type CreateSectionInput = {
  title: string;
  lectures: CreateLectureInput[];
};

export type CreateCourseInput = {
  title: string;
  summary: string;
  description: string;
  thumbnailUrl: string;
  category: string[];
  level: string;
  price: number | string;
};
