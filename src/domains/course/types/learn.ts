import { EnrollmentStatus } from '@/domains/user/types/enrollment';

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
  userId: string;
  courseId: string;
  studentId: string;
  status: EnrollmentStatus;
  progressRate: number;
  createdAt: string;
  expiredAt: string;
};

export type LearnLectureProgressResponse = {
  resourceId: string;
  title: string;
  currentProgressRate: number; // 0~100
  watchedDuration: number; // 초
  totalDurationSeconds: number;
  isCompleted: boolean;
  lastWatchedAt: string | null;
};

export type LearnProgressResponse = {
  enrollmentId: string;
  progressRate: number;

  lastVideoId: string | null;
  lastWatchedDuration: number;
  lastWatchedAt: string | null;

  lectureProgresses: LearnLectureProgressResponse[];
  updatedAt: string;
};

export type PatchLearnProgressPayload = {
  resourceId: string;
  watchedDuration: number;
};

export type CourseLearn = {
  course: LearnCourseResponse;
  enrollment: LearnEnrollmentResponse;
  progress: LearnProgressResponse;
};

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
