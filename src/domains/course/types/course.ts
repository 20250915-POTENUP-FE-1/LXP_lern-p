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
  resource: LectureResource[];
  sequence: number;
  createdAt: string;
  updatedAt: string;
};

// === 1. 폼타입 (UI <-> 비즈니스 로직)

// 강좌 생성/ 수정
export type CourseDraftForm = {
  title: string;
  summary: string;
  description: string;
  category: string[];
  level: string;
  price: number | string;
  thumbnailUrl: string;
};

// 섹션 생성 / 수정
export type SectionDraftForm = {
  id: string;
  title: string;
  lectures: LectureDraftForm[];
};

// 강의 생성 / 수정
export type LectureDraftForm = {
  id: string;
  title: string;
  duration: number;
  videoUrl: string;
  isPreview: boolean;
  resource: LectureResource[];
};

// === 2. 내부 데이터 구조

// 강의 리소스 타입
export type LectureResource = {
  resourceType: 'VIDEO' | 'PDF' | 'DOC' | 'ZIP';
  isDownloadable: boolean;
  fileUrl: string;
};

// 강좌 수강 상태
export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  enrolledAt: string;
};

// 강좌 생성/수정 폼 상태
export type CourseDetailResponse = {
  course: Course | null;
  sections: Section[];
  lectures: Record<string, Lecture[]>;
};

// ==== 3. API 요청 타입 (프론트 <-> 백엔드)

//강좌 생성/수정 요청
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

// ==== 4. API 응답 타입 (백엔드 → 프론트)
// 섹션 생성 응답
export type CreateSectionResponse = {
  sectionId: number;
  title: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

// 강의 생성 응답
export type CreateLectureResponse = {
  lectureId: number;
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

//===== 1. 강좌 생성/수정/발행 응답 =====
/*
export type CourseIdResponse = {
  courseId: number;
};

export type PublishCourseResponse = {
  id: number;
  title: string;
  courseState: 'PUBLISHED' | 'DRAFT' | 'HIDDEN';
};
===== 2. 강좌 상세/임시 상세 조회 응답 =====

export type CourseDetailApiSectionLectureResource = {
  resourceType: 'VIDEO' | 'PDF' | 'DOC' | 'ZIP';
  fileUrl: string;
  isDownloadable: boolean;
};

export type CourseDetailApiSectionLecture = {
  lectureId: number;
  title: string;
  totalDurationSeconds?: number;  //
  isPreview: boolean;
  orderIndex: number;
  resources: CourseDetailApiSectionLectureResource[];
};

export type CourseDetailApiSection = {
  sectionId: number;
  title: string;
  order?: number;          //
  orderIndex?: number;     // 
  lectures: CourseDetailApiSectionLecture[];
};

export type CourseDetailApiData = {
  courseId: number;
  categories: string[];
  title: string;
  summary: string;
  description: string;
  price: number;
  status: 'PUBLISHED' | 'DRAFT';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnailUrl: string | null;
  instructor: {
    id: number;
    name: string;
    profileUrl: string;
  };
  isPurchased: boolean;
  studentCount: number;
  totalduration: number;
  sections: CourseDetailApiSection[];
  // 임시생성 강좌 조회용 필드
  instructorName?: string;
  lastModifiedAt?: string;
};



// ===== 3. 강좌 목록 조회 응답 =====
export type CourseListItemApi = {
  courseId: number;
  title: string;
  categories: string[];
  thumbnailUrl: string | null;
  status: 'PUBLISHED' | 'DRAFT';
  price: number;
  studentCount: number;
  rating: number;
  lastModifiedAt: string;
};

export type PaginatedCoursesApi = {
  content: CourseListItemApi[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};


// ===== 4. 섹션/강의 순서 변경 요청 =====

export type ReorderSectionsRequest = {
  sectionIds: number[];
};

export type ReorderLecturesRequest = {
  lectures: {
    lectureId: number;
    orderIndex: number;
  }[];
};

// ===== 5. 강의 목록 조회 응답 =====
export type LectureListItemApi = {
  sectionId: number;
  lectureId: number;
  title: string;
  description: string;
  orderIndex: number;
  createdAt: string;
};

// ===== 7. API 공통 응답 래퍼 =====
export type ApiResponse<T> = {
  status: string;
  code: string;
  message: string;
  data: T;
};
*/
