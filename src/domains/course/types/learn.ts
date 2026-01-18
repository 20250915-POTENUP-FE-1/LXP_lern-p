import { EnrollmentStatus } from '@/domains/user/types/enrollment';

// API: Course / Enrollment
export type LearnLectureResourceResponse = {
  resourceId: string;
  resourceType: 'VIDEO' | 'PDF';
  fileUrl: string;
  isDownloadable: boolean;
};

export type LearnLectureResponse = {
  lectureId: string;
  title: string;
  totalDurationSeconds: number;
  isPreview: boolean;
  orderIndex: number;
  resource: LearnLectureResourceResponse;
};

export type LearnSectionResponse = {
  sectionId: string;
  title: string;
  order: number;
  lectures: LearnLectureResponse[];
};

export type LearnCourseResponse = {
  courseId: string;
  title: string;
  summary: string;
  description: string;
  categories: string[];
  level: string;
  price: number;
  status: string;
  thumbnailUrl: string;
  instructor: {
    id: string;
    name: string;
    profileUrl: string;
  };
  isPurchased: boolean;
  studentCount: number;
  totalDuration: number;
  sections: LearnSectionResponse[];
};

export type LearnEnrollmentResponse = {
  enrollmentId: string;
  courseId: string;
  studentId: string;
  status: EnrollmentStatus;
  progressRate: number;
  createdAt: string;
  expiredAt: string;
};

// Domain: Course + Enrollment
export type CourseLearn = {
  course: LearnCourseResponse;
  enrollment: LearnEnrollmentResponse;
};

// UI Types (Learn Page)
export type UILecture = {
  id: string;
  resourceId: string;
  title: string;
  description?: string;
  duration: number;
  type: 'VIDEO' | 'PDF';
  videoUrl?: string;
  pdfUrl?: string;
};

export type UISection = {
  id: string;
  title: string;
  order: number;
  lectures: UILecture[];
};

export type UICourse = {
  courseId: string;
  title: string;
  summary: string;
  description: string;
  categories: string[];
  level: string;
  price: number;
  status: string;
  thumbnailUrl: string;
  instructor: {
    id: string;
    name: string;
    profileUrl: string;
  };
  sections: UISection[];
};
