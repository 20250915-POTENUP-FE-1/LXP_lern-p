import type {
  LearnCourseResponse,
  LearnEnrollmentResponse,
  LearnProgressResponse,
} from '@/domains/course/types/learn';

export const MOCK_LEARN_COURSE_MAP: Record<string, LearnCourseResponse> = {
  '2001': {
    courseId: '2001',
    title: '스프링 부트 완벽 가이드',
    summary: '스프링 부트의 모든 것',
    description: '기초부터 실전까지',
    categories: ['백엔드'],
    level: 'BEGINNER',
    price: 55000,
    status: 'PUBLISHED',
    thumbnailUrl: 'https://',
    isPurchased: true,
    studentCount: 10,
    totalDuration: 120,

    instructor: {
      id: '9001',
      name: '김영한',
      profileUrl: '',
    },

    sections: [
      {
        sectionId: '3001',
        title: '1. JPA 시작하기',
        order: 1,
        lectures: [
          {
            lectureId: '4001',
            title: 'JPA란?',
            totalDurationSeconds: 10,
            isPreview: false,
            orderIndex: 1,
            resource: {
              resourceId: '5001',
              resourceType: 'VIDEO',
              fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              isDownloadable: false,
            },
          },
          {
            lectureId: '4002',
            title: '엔티티 매핑',
            totalDurationSeconds: 10,
            isPreview: false,
            orderIndex: 2,
            resource: {
              resourceId: '5002',
              resourceType: 'VIDEO',
              fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              isDownloadable: false,
            },
          },
        ],
      },
      {
        sectionId: '3002',
        title: '2. 연관관계',
        order: 2,
        lectures: [
          {
            lectureId: '4003',
            title: '연관관계 기본',
            totalDurationSeconds: 10,
            isPreview: false,
            orderIndex: 1,
            resource: {
              resourceId: '5003',
              resourceType: 'VIDEO',
              fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              isDownloadable: false,
            },
          },
          {
            lectureId: '4004',
            title: '양방향 매핑',
            totalDurationSeconds: 10,
            isPreview: false,
            orderIndex: 2,
            resource: {
              resourceId: '5004',
              resourceType: 'VIDEO',
              fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              isDownloadable: false,
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

export const MOCK_LEARN_PROGRESS = {
  enrollmentId: '5001',
  progressRate: 25,

  lastVideoId: '3001',
  lastWatchedDuration: 120,
  lastWatchedAt: '2025-12-02T09:30:00',

  lectureProgresses: [
    {
      resourceId: '3001',
      title: '강의 1',
      currentProgressRate: 100,
      watchedDuration: 240,
      totalDurationSeconds: 240,
      isCompleted: true,
      lastWatchedAt: '2025-12-02T09:30:00',
    },
    {
      resourceId: '3002',
      title: '강의 2',
      currentProgressRate: 0,
      watchedDuration: 0,
      totalDurationSeconds: 300,
      isCompleted: false,
      lastWatchedAt: null,
    },
  ],

  updatedAt: '2025-12-02T09:30:00',
};

export let mockLearnProgress = {
  enrollmentId: 'mock-enrollment-1',
  lastVideoId: null,
  lastWatchedDuration: 0,
  completedLectureIds: [] as string[],
  progressRate: 0,
  updatedAt: new Date().toISOString(),
};
