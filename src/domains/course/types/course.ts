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
};

// === 2. 내부 데이터 구조

export type DraftMeta = {
  _dirty: boolean;
  _deleted?: boolean;
};

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
