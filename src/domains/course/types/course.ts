// === 0. 기본
export type Course = {
  id: string;
  title: string;
  summary: string;
  description: string;
  thumbnailUrl: string;

  instructorId: string;
  instructorName: string;

  category: string[];
  level: CourseLevel;
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
  isPreview: boolean;
  sequence: number;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  categoryId: number;
  name: string;
  children: CategoryChild[];
};
export type CategoryChild = {
  categoryId: number;
  name: string;
};

// 강좌 생성/ 수정
export type CourseDraftForm = {
  title: string;
  summary: string;
  description: string;
  category: string[];
  level: string;
  price: number | string;
  thumbnail: string;
  status?: string;
};

// 섹션 생성 / 수정
export type SectionDraftForm = DraftMeta & {
  localId: string;
  id: string;
  title: string;
  lectures: LectureDraftForm[];
};

// 강의 생성 / 수정
export type LectureDraftForm = DraftMeta & {
  localId: string;
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  isPreview: boolean;
  resource: LectureResource[];
  file?: File;
};

// === 2. 내부 데이터 구조

export type DraftMeta = {
  _dirty: boolean;
  _deleted?: boolean;
};

// 강의 리소스 타입
export type LectureResource = {
  resourceType?: 'VIDEO' | 'PDF' | 'DOC' | 'ZIP' | undefined;
  isDownloadable?: boolean;
  fileUrl?: string;
};

// 강좌 수강 상태
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

//강좌 생성/수정 요청
export type CreateCourseRequest = {
  title: string;
  summary: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  price: number | string;
  courseLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
};
export type UpdateCourseRequest = CreateCourseRequest;

// 섹션 생성 요청
export type CreateSectionRequest = {
  title: string;
  orderIndex: number;
};

export type UpdateSectionRequest = {
  title: string;
  orderIndex: number;
};

// 강의 생성/ 수정 요청
export type CreateLectureRequest = {
  title: string;
  totalDurationSeconds: number;
  isPreview: boolean;
  orderIndex: number;
  resource: {
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

// 강좌 생성 응답
export type CreateCourseResponse = CourseIdResponse;

// 섹션 생성 응답
export type CreateSectionResponse = {
  sectionId: string;
  title: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

// 강의 생성 응답
export type CreateLectureResponse = {
  lectureId: string;
  title: string;
  isPreview: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  resource: {
    resourceType: 'VIDEO' | 'PDF' | 'DOC' | 'ZIP';
    isDownloadable: boolean;
    fileUrl: string;
  };
};

export type CourseIdResponse = {
  courseId: string;
};

// 섹션/강의 순서 변경 요청

export type ReorderSectionsRequest = {
  sectionIds: string[];
};

export type ReorderLecturesRequest = {
  lectures: {
    lectureId: string;
    orderIndex: number;
  }[];
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

export type EnrollmentStatus = 'ENROLLED' | 'COMPLETED' | 'CANCELED' | 'EXPIRED';

export type GetEnrollmentResponse = {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  progressRate: 45;
  createdAt: string;
  expiredAt: string;
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

export type GetDraftCourseResponse = {
  courseDraft: CourseDraftForm;
  sectionDrafts: SectionDraftForm[];
};

// 리뷰 관련 타입
export type ReviewStatus = 'DISPLAY' | 'BLINDED' | 'DELETED' | 'ARCHIVED';

export type Review = {
  id: string;
  courseId: string;
  rating: number; // 1 ~ 5
  content: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  user: {
    nickname: string;
  };
  isMine: boolean;
  status: ReviewStatus;
};
