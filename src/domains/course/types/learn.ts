import type { Enrollment } from '@/domains/enrollment/types/enrollment';
import type { Progress } from '@/domains/enrollment/types/progress';

export type LearnLectureResource = {
  resourceId: number;
  resourceType: 'VIDEO' | 'PDF';
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
