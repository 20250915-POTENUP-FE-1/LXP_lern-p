import type { Enrollment } from '@/domains/user/types/enrollment';

/* --------------------------------------------- */
/* 1. Domain Models (백엔드 엔티티 그대로 사용) */
/* --------------------------------------------- */

export type LearnLectureResource = {
  resourceId: number;
  resourceType: 'VIDEO' | 'PDF' | 'ZIP' | 'DOC';
  fileUrl: string;
  isDownloadable: boolean;
};

export type LearnLecture = {
  lectureId: number;
  title: string;
  duration: number; // seconds
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

export type LearnProgress = {
  learningRecordId: number;
  enrollmentId: number;
  progressRate: number;
  lastVideoId: number;
  lastWatchedDuration: number;
  updatedAt: string;
};

export type CourseLearn = {
  course: LearnCourse;
  enrollment: Enrollment | null;
  progress: LearnProgress | null;
};

/* --------------------------------------------- */
/* 2. Response DTO (data 필드만 유지)           */
/* --------------------------------------------- */

export type ApiResponse<T> = { data: T };

export type CourseDetailResponse = ApiResponse<LearnCourse>;

export type EnrollmentListItem = Enrollment & {
  enrollmentId: number;
  courseId: number;
};

export type EnrollmentListPage = {
  content: EnrollmentListItem[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
};

export type EnrollmentListResponse = ApiResponse<EnrollmentListPage>;

export type ProgressResponse = ApiResponse<LearnProgress | null>;
