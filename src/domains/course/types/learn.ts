import type { Enrollment } from '@/domains/course/types/enrollment';
import type { Progress } from '@/domains/course/types/progress';

export type LearnLectureResource = {
  resourceId: number;
  resourceType: 'VIDEO' | 'PDF' | 'ZIP' | 'DOC';
  fileUrl: string;
  isDownloadable: boolean;
};

export type LearnLecture = {
  lectureId: number;
  title: string;
  duration: number;
  isPreview: boolean;
  orderIndex: number;
  resource: LearnLectureResource;
};

export type LearnSection = {
  sectionId: number;
  title: string;
  order: number;
  lectures: LearnLecture[];
};

export type LearnCourse = {
  courseId: number;
  categories: string[];
  title: string;
  summary: string;
  description: string;
  price: number;
  status: string;
  level: string;
  thumbnailUrl: string;
  instructor: {
    id: number;
    name: string;
    profileUrl: string;
  };
  isPurchased: boolean;
  studentCount: number;
  totalduration: number;
  sections: LearnSection[];
};

export type LearnPageData = {
  course: LearnCourse;
  enrollment: Enrollment | null;
  progress: Progress | null;
};

export type CourseDetailResponse = {
  status: string;
  code: string;
  message: string;
  data: LearnCourse;
};

export type EnrollmentListItem = LearnPageData['enrollment'] & {
  enrollmentId: number;
  courseId: number;
};

export type EnrollmentListResponse = {
  status: string;
  code: string;
  message: string;
  data: {
    content: EnrollmentListItem[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
};

export type ProgressResponse = {
  status: string;
  code: string;
  message: string;
  data: LearnPageData['progress'];
};

export type UILecture = {
  id: string;
  title: string;
  type: 'VIDEO' | 'PDF' | 'ZIP' | 'DOC';
  duration?: string;
  description: string;
  completed: boolean;
  videoUrl?: string;
  pdfUrl?: string;
};

export type UISection = {
  id: string;
  title: string;
  description: string;
  lectures: UILecture[];
};

export type UICourse = {
  id: string;
  title: string;
  instructor: string;
  description: string;
  sections: UISection[];
};
