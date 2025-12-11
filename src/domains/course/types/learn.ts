import type { EnrollmentStatus } from '@/domains/user/types/enrollment';

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
  title: string;
  summary: string;
  description: string;
  categories: string[];
  level: string;
  price: number;
  status: string;
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

/* ---------------------------------------------
 * 2. Enrollment (단건 조회)
 * --------------------------------------------- */
export type LearnEnrollmentResponse = {
  enrollmentId: number;
  courseId: number;
  studentId: number;
  status: EnrollmentStatus;
  progressRate: number;
  createdAt: string;
  expiredAt: string;
};

/* ---------------------------------------------
 * 3. Progress (단건 조회)
 * --------------------------------------------- */
export type LearnProgressResponse = {
  learningRecordId: number;
  enrollmentId: number;
  progressRate: number;
  lastVideoId: number;
  lastWatchedDuration: number;
  updatedAt: string;
};

/* ---------------------------------------------
 * 4. Combined Learn Page Model
 * --------------------------------------------- */
export type CourseLearn = {
  course: LearnCourse;
  enrollment: LearnEnrollmentResponse | null;
  progress: LearnProgressResponse | null;
};
