import type {
  LearnCourseResponse,
  LearnEnrollmentResponse,
  LearnProgressResponse,
} from '@/domains/course/types/learn';

export const MOCK_LEARN_COURSE_MAP: Record<string, LearnCourseResponse> = {
  '2001': {
    courseId: '2001',
    title: '스프링 부트 완벽 가이드',
    summary: '...',
    description: '...',
    categories: ['백엔드'],
    level: 'BEGINNER',
    price: 55000,
    status: 'PUBLISHED',
    thumbnailUrl: 'https://',

    instructor: {
      id: '9001',
      name: '김영한',
      profileUrl: '...',
    },

    isPurchased: true,
    studentCount: 10,
    totalDuration: 7200,

    sections: [
      {
        sectionId: '3001',
        title: '1. JPA 시작하기',
        order: 1,
        lectures: [
          {
            lectureId: '4001',
            title: 'JPA란 무엇인가',
            totalDurationSeconds: 600,
            isPreview: false,
            orderIndex: 1,
            resource: {
              resourceId: '5001',
              resourceType: 'VIDEO',
              fileUrl: 'https://example-video-url.mp4',
              isDownloadable: true,
            },
          },
        ],
      },
    ],
  },

  '2002': {
    courseId: '2002',
    title: 'React & Next.js 완전 정복',
    summary: '...',
    description: '...',
    categories: ['프론트엔드'],
    level: 'INTERMEDIATE',
    price: 66000,
    status: 'PUBLISHED',
    thumbnailUrl: 'https://',

    instructor: {
      id: '9002',
      name: '강사B',
      profileUrl: '...',
    },

    isPurchased: true,
    studentCount: 20,
    totalDuration: 8400,

    sections: [
      {
        sectionId: '3101',
        title: '1. React 기초',
        order: 1,
        lectures: [
          {
            lectureId: '4101',
            title: 'React란?',
            totalDurationSeconds: 500,
            isPreview: false,
            orderIndex: 1,
            resource: {
              resourceId: '5101',
              resourceType: 'VIDEO',
              fileUrl: 'https://example-react-video.mp4',
              isDownloadable: true,
            },
          },
        ],
      },
    ],
  },
};

export const MOCK_LEARN_ENROLLMENT: LearnEnrollmentResponse = {
  enrollmentId: '5001',
  userId: 'u-001',
  courseId: '2001',
  studentId: 'u-001',
  status: 'ENROLLED',
  progressRate: 45,
  createdAt: '2025-12-02T09:00:00',
  expiredAt: '2026-01-01T09:00:00',
};

export const MOCK_LEARN_PROGRESS: LearnProgressResponse = {
  learningRecordId: '6001',
  enrollmentId: '5001',
  progressRate: 45,
  lastVideoId: '4001',
  lastWatchedDuration: 300,
  updatedAt: '2025-12-02T09:30:00',
};
