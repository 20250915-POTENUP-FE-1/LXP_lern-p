import { db } from '@/shared/lib/firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

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

export type CourseStatus = Course['status'];

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

export type SectionFormProps = {
  mode: 'create' | 'edit';
  courseId?: string;
};
export type CourseFormProps = {
  mode: 'create' | 'edit';
  courseId?: string;
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

{
  /*fetchCourseData의 반환 타입, updateCourseBasicInfo 및 saveCourseDraft의 인풋 타입*/
}
export type CourseDraft = {
  title: string;
  summary: string;
  description: string;
  category: string[];
  level: string;
  price: number | string;
  thumbnailUrl: string;
};

{
  /*fetchCourseWithSections 에서 사용됨??*/
}
export type LectureDraft = {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
};

export type SectionDraft = {
  id: string;
  title: string;
  lectures: LectureDraft[];
};
