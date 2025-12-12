// ------------------------------------------------------
// Learn 도메인 타입 (백엔드 API Response 그대로 매핑)
// ------------------------------------------------------

import { EnrollmentStatus } from '@/domains/user/types/enrollment';

export type LearnLectureResource = {
  resourceId: string;
  resourceType: 'VIDEO' | 'PDF';
  fileUrl: string;
  isDownloadable: boolean;
};

export type LearnLecture = {
  lectureId: string;
  title: string;
  totalDurationSeconds: number;
  isPreview: boolean;
  orderIndex: number;
  resource: LearnLectureResource;
};

export type LearnSection = {
  sectionId: string;
  title: string;
  order: number;
  lectures: LearnLecture[];
};

export type LearnCourse = {
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

  sections: LearnSection[];
};

export type LearnEnrollmentResponse = {
  enrollmentId: string;
  userId: string;
  courseId: string;
  studentId: string;
  status: EnrollmentStatus;
  progressRate: number;
  createdAt: string;
  expiredAt: string;
};

export type LearnProgressResponse = {
  learningRecordId: string;
  enrollmentId: string;
  progressRate: number;
  lastVideoId: string;
  lastWatchedDuration: number;
  updatedAt: string;
};

export type CourseLearn = {
  course: LearnCourse;
  enrollment: LearnEnrollmentResponse | null;
  progress: LearnProgressResponse | null;
};

// ------------------------------------------------------
// UI용 타입
// ------------------------------------------------------

export type UILecture = {
  id: string;
  title: string;
  description?: string;
  duration: number;
  type: 'VIDEO' | 'PDF';
  videoUrl?: string;
  pdfUrl?: string;
  completed: boolean;
  isCurrent: boolean;
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
