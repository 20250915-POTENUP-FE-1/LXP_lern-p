import type { EnrollmentStatus } from '@/domains/user/types/enrollment';

export type LearnLectureResource = {
  resourceId: string;
  resourceType: 'VIDEO' | 'PDF' | 'ZIP' | 'DOC';
  fileUrl: string;
  isDownloadable: boolean;
};

export type LearnLecture = {
  lectureId: string;
  title: string;
  duration: number;
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
  totalduration: number;

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
  enrollment: LearnEnrollmentResponse;
  progress: LearnProgressResponse;
};
