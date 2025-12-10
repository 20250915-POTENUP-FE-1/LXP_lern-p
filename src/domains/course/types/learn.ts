// learn.ts
// Learn 도메인 타입 정의
// 구조 규칙
// 1) Domain Model: 백엔드 비즈니스 엔티티 그대로 표현
// 2) Response DTO: HTTP 응답 구조(래퍼 포함)
// 3) UI Model: 프론트에서 화면 렌더링용 가공 모델

import type { Enrollment } from '@/domains/user/types/enrollment';

/* -------------------------------------------------------------------------- */
/* 1. DOMAIN MODEL (백엔드 응답 구조 기반 비즈니스 엔티티)                    */
/* -------------------------------------------------------------------------- */

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
  categories: string[]; // 강좌 카테고리
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
  totalduration: number; // API 필드명 유지
  sections: LearnSection[];
};

/**
 * 강좌 전체 학습 진행 상태 (도메인 Progress)
 * EnrollmentProgress와 다름 (lecture 단위가 아니라 course 기준)
 */
export type LearnProgress = {
  learningRecordId: number;
  enrollmentId: number;
  progressRate: number;
  lastVideoId: number;
  lastWatchedDuration: number;
  updatedAt: string;
};

/**
 * 강좌 시청 페이지를 구성하는 도메인 단위 데이터
 * - 도메인 모델의 조합(프론트 전용 모델 아님)
 */
export type CourseLearn = {
  course: LearnCourse;
  enrollment: Enrollment | null;
  progress: LearnProgress | null;
};

/* -------------------------------------------------------------------------- */
/* 2. RESPONSE DTO (HTTP 응답 래퍼)                                           */
/* -------------------------------------------------------------------------- */

export type CourseDetailResponse = {
  status: string;
  code: string;
  message: string;
  data: LearnCourse;
};

/**
 * 수강 목록 조회 아이템
 * LearnPageModel['enrollment']는 nullable이라 NonNullable 처리
 */
export type EnrollmentListItem = Enrollment & {
  enrollmentId: number;
  courseId: number;
};

export type EnrollmentListResponse = {
  status: string;
  code: string;
  message: string;
  data: {
    content: EnrollmentListItem[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
};

export type ProgressResponse = {
  status: string;
  code: string;
  message: string;
  data: CourseLearn['progress'];
};

/* -------------------------------------------------------------------------- */
/* 3. UI MODEL (프론트 렌더링 전용 가공 타입)                                */
/* -------------------------------------------------------------------------- */

export type UILecture = {
  id: string;
  title: string;
  type: 'VIDEO' | 'PDF' | 'ZIP' | 'DOC';
  duration?: string;
  description: string;
  completed: boolean;
  videoUrl?: string;
  pdfUrl?: string;
};

export type UISection = {
  id: string;
  title: string;
  description: string;
  lectures: UILecture[];
};

export type UICourse = {
  id: string;
  title: string;
  instructor: string;
  description: string;
  sections: UISection[];
};
