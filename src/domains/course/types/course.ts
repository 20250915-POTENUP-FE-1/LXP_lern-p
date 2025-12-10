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
  isPreview: boolean;
  resource: LectureResource;
  sequence: number;
  createdAt: string;
  updatedAt: string;
};

export type CourseDraft = {
  title: string;
  summary: string;
  description: string;
  category: string[];
  level: string;
  price: number | string;
  thumbnailUrl: string;
};

export type LectureDraft = {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  isPreview: boolean;
  resource: LectureResource;
};

export type SectionDraft = {
  id: string;
  title: string;
  lectures: LectureDraft[];
};

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  enrolledAt: string;
};

export type LectureResource = {
  resourceType: 'VIDEO' | 'PDF' | 'DOC' | 'ZIP';
  isDownloadable: boolean;
  fileUrl: string;
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

export type CourseStatus = Course['status'];

/** 요청 DTO 쪽 네이밍 */
export type CreateCourseRequest = {
  title: string;
  summary: string;
  description: string;
  thumbnailUrl: string;
  categoryId: number;
  price: number | string;
  courseLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
};
export type UpdateCourseRequest = CreateCourseRequest;

export type CreateSectionRequest = {
  title: string;
  orderIndex: number;
};
export type UpdateSectionRequest = {
  title: string;
  orderIndex: number;
};

export type CreateLectureRequest = {
  title: string;
  totalDurationSeconds: number;
  isPreview: boolean;
  orderIndex: number;
  resource: {
    resourceType: 'VIDEO' | 'PDF' | 'DOC' | 'ZIP';
    isDownloadable: boolean;
    fileUrl?: string;
  };
};

export type UpdateLectureRequest = {
  title: string;
  totalDurationSeconds: number;
  isPreview: boolean;
  resource: {
    isDownloadable: boolean;
    fileUrl?: string;
  };
};

// 공용 API 응답 타입
export type ApiResponse<T> = {
  status: string;
  code: string;
  message: string;
  data: T;
};

export type ApiErrorBody = {
  status: string;
  code: string;
  message: string;
};

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
