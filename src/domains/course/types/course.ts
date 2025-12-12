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
  status: Status;

  createdAt?: string;
  updatedAt?: string;

  sections: string[];
};

export type Section = {
  id: string;
  courseId: string;
  title: string;
  sequence: number;
  lectures: string[];
};

export type Lecture = {
  id: string;
  sectionId: string;
  courseId: string;
  title: string;
  resource: Resource;
  duration: number;
  sequence: number;
  createdAt: string;
  updatedAt: string;
};

export type Resource = {
  resourceType: ResourceType;
  fileUrl: string;
  isDownloadable: boolean;
};

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  enrolledAt: string;
};

export type CourseDetail = {
  course: Course | null;
  sections: Section[];
  lectures: Record<string, Lecture[]>;
};

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

export type Status = 'DRAFT' | 'PUBLISHED' | 'DELETED';
export type CourseLevel = 'BEGINNER' | 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED';

export type GetAllCourseResponse = {
  content: Array<{
    courseId: string;
    title: string;
    categories: string[];
    thumbnailUrl: string;
    status: Status;
    price: number;
    studentCount: number;
    rating: number;
    lastModifiedAt: string;
    level: CourseLevel;
    summary: string;
    instructorName: string;
  }>;
  cureentPage: number;
  size: number;
  totalElements: number;
  totalPages: string;
  hasNext: boolean;
};

export type GetCourseDetailResponse = {
  courseId: string;
  title: string;
  categories: string[];
  thumbnailUrl: string;
  summary: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    profileUrl: string;
  };
  isPurchased: boolean;
  totalDuration: number;
  status: Status;
  price: number;
  level: CourseLevel;
  studentCount: number;
  rating: number;
  sections: SectionDetailResponse[];
};

export type SectionDetailResponse = {
  sectionId: string;
  title: string;
  order: number;
  lectures: LectureDetailResponse[];
};

export type LectureDetailResponse = {
  lectureId: string;
  title: string;
  totalDurationSeconds: number;
  isPreview: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  resource: {
    resourceType: ResourceType;
    fileUrl: string;
    isDownloadable: boolean;
  };
};

export type ResourceType = 'VIDEO' | 'PDF' | 'ZIP' | 'DOC';

export type CourseCardType = Omit<
  Course,
  'description' | 'sections' | 'duration' | 'status' | 'instructorId'
>;
