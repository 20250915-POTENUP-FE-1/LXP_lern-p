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

// 강좌 생성/ 수정 //안씀
export type CourseDraftForm = {
  title: string;
  summary: string;
  description: string;
  category: string[];
  level: CourseLevel;
  price: number | string;
  thumbnail?: string;
  status?: string;
};

// 섹션 생성 / 수정 //안씀
export type SectionDraftForm = DraftMeta & {
  localId: string;
  id: string;
  title: string;
  lectures: LectureDraftForm[];
};

// 강의 생성 / 수정 //안씀
export type LectureDraftForm = DraftMeta & {
  localId: string;
  id?: string; // 각각 courseId, lectureId 가 없을 경우에 local 의 경우를 만들기 위해
  title: string;
  duration: number;
  videoUrl: string;
  isPreview: boolean;
  resource: LectureResource[];
  file?: File;
};

// === 2. 내부 데이터 구조

//안씀
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
  //thumbnail?: string; // TODO: 추후에 반영 예정
  categoryId: number;
  price: number | string;
  courseLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'NOVICE';
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
  isPreview: boolean;
  orderIndex: number;
  resourceKey: string;
};

export type UpdateLectureRequest = {
  title: string;
  isPreview: boolean;
  resourceKey: string;
  orderIndex: number;
};

// 강좌 생성 응답
export type CreateCourseResponse = {
  courseId: string;
};

// 섹션 생성 응답
export type CreateSectionResponse = {
  sectionId: string;
  title: string;
  orderIndex: number;
};

// 강의 생성 응답
export type CreateLectureResponse = {
  lectureId: string;
  title: string;
  totalDurationSeconds: number;
  isPreview: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  resource: {
    resourceType: 'VIDEO' | 'PDF' | 'DOC' | 'ZIP';
    fileUrl: string;
    isDownloadable: boolean;
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
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'NOVICE';

export type GetAllCourseResponse = {
  content: Array<{
    courseId: string;
    title: string;
    categories: string[];
    thumbnailUrl?: string;
    status: Status;
    price: number;
    studentCount: number;
    rating: number;
    lastModifiedAt: string;
    level: CourseLevel;
    summary: string;
    instructorName: string;
    reviewStat: {
      reviewCount: number;
      avgRating: number;
    };
  }>;
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

export type GetCourseDetailResponse = {
  courseId: string;
  title: string;
  categories: string[];
  thumbnailUrl?: string;
  summary: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    profileUrl: string;
  };
  isPurchased: boolean;
  totalDuration: number;
  price: number;
  status: Status;
  level: CourseLevel;
  studentCount: number;
  sections: SectionDetailResponse[];
  reviewStat: {
    reviewCount: number;
    avgRating: number;
  };
};

export type EnrollmentStatus = 'ENROLLED' | 'COMPLETED' | 'CANCELED' | 'EXPIRED';

export type GetEnrollmentResponse = {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  progressRate: number;
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

// 안씀
export type GetDraftCourseResponse = {
  courseDraft: CourseDraftForm;
  sectionDrafts: SectionDraftForm[];
};

// 1번 타입에 없던(= 2번에서 추가된) 내용 모음

// ===== API: 강좌 생성 / 수정 =====
export type UpdateCourseResponse = {
  courseId: string; //number?
};

// ===== API: 섹션 생성 / 수정 =====
export type UpdateSectionResponse = {
  sectionId: string;
  title: string;
  orderIndex: number;
  updatedAt: string;
};

// ===== API: Presigned URL 생성 =====
export type CreateLectureResourcePresignedUrlRequest = {
  fileName: string;
  contentType: string;
  size: number;
  duration: number;
  isDownloadable: boolean;
};

export type CreateLectureResourcePresignedUrlResponse = {
  presignedUrl: string;
  key: string;
  method: 'PUT' | 'GET';
  expireSeconds: number;
};

// 썸네일 업로드 url 생성 API
export type CreateThumbnailPresignedUrlResponse = {
  presignedUrl: string;
  key: string;
};

export type DeleteSectionRequest = {};
export type DeleteSectionResponse = {
  sectionId?: string;
};

// ===== 강의 수정 API =====
export type UpdateLectureResponse = {
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

// ===== API: 강좌 발행 =====
export type PublishCourseResponse = {
  id: number;
  title: string;
  courseState: 'PUBLISHED';
};

export type LectureResourceResponse = {
  resourceType: ResourceType;
  fileUrl: string;
  isDownloadable: boolean;
};

// Draft 용 타입
