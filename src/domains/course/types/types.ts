// src/domains/auth/types.ts
export type User = {
  id: string;
  email: string;
  name: string;
  roles: ('USER' | 'INSTRUCTOR')[];
  cart: string[];
  enrolledCourses: string[];
  createdCourses: string[];
  createdAt: string;
  updatedAt: string;
};
// src/domains/course/types.ts

export type Course = {
  id: string;
  title: string;
  summary: string;
  description: string;
  thumbnailUrl: string;

  instructorId: string;
  instructorName: string;

  category: string[]; // ["프로그래밍","웹","프론트엔드"]
  level: string; // "초급" 등
  tags: string[];

  price: number;
  isFree: boolean;

  studentCount: number;
  // averageRating?: number;
  // reviewCount?: number;

  duration: number; // 총 길이(분)
  status: 'draft' | 'published' | 'hidden';

  createdAt: string;
  updatedAt: string;

  sections: string[]; // section id[]
};

export type Section = {
  id: string;
  courseId: string;
  title: string;
  sequence: number;
  lectures: string[]; // lecture id[]
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

// 강의 상세에서 쓰는 응답 구조 (이미 getCourse가 이렇게 리턴한다고 가정)
export type CourseDetailResponse = {
  course: Course | null;
  sections: Section[];
  lectures: Record<string, Lecture[]>; // key = sectionId
};

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  enrolledAt: string;
};

// =============================
// Course Detail Hooks 타입
// =============================
export type UseCourseDetailResult = {
  course: Course | null;
  sections: Section[];
  lectures: Record<string, Lecture[]>;
  loading: boolean;
};

export type UseCourseApplyResult = {
  isEnrolled: boolean;
  applying: boolean;
  handleApply: () => Promise<void>;
};

// =============================
// Floating CTA Props 타입
// =============================
export type FloatingCTAProps = {
  price: number;
  isFree: boolean;
  isEnrolled: boolean;
  onApply: () => void;
  isOwner: boolean;

  instructorName: string;
  totalLectures: number;
  totalTime: string;
  level: string;

  onAddToCart?: () => void;
};

// =============================
// Course Detail Tab 타입
// =============================
export type CourseDetailTabKey = 'intro' | 'curriculum' | 'instructor';

// =============================
// Detail View용 통합 타입
// =============================
export type CourseWithDetail = Course & {
  sections: Section[];
  lectures: Record<string, Lecture[]>;
};
