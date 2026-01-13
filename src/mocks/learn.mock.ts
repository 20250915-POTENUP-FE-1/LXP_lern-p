import type { LearnCourseResponse, LearnEnrollmentResponse } from '@/domains/course/types/learn';
import { UpdateProgressResponse } from '@/domains/course/types/progress';

export const MOCK_LEARN_COURSE_MAP: Record<string, LearnCourseResponse> = {
  '2002': {
    courseId: '2002',
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
        sectionId: 's1',
        title: '1. JPA 시작하기',
        order: 1,
        lectures: [
          {
            lectureId: '3001',
            title: 'JPA란?',
            totalDurationSeconds: 10,
            isPreview: false,
            orderIndex: 1,
            resource: {
              resourceId: '3001',
              resourceType: 'VIDEO',
              fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              isDownloadable: false,
            },
          },
          {
            lectureId: '3002',
            title: '엔티티 매핑',
            totalDurationSeconds: 10,
            isPreview: false,
            orderIndex: 2,
            resource: {
              resourceId: '3002',
              resourceType: 'VIDEO',
              fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              isDownloadable: false,
            },
          },
        ],
      },
      {
        sectionId: 's2',
        title: '2. 연관관계',
        order: 2,
        lectures: [
          {
            lectureId: '3003',
            title: '연관관계 기본',
            totalDurationSeconds: 10,
            isPreview: false,
            orderIndex: 3,
            resource: {
              resourceId: '3003',
              resourceType: 'VIDEO',
              fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              isDownloadable: false,
            },
          },
          {
            lectureId: '3004',
            title: '양방향 매핑',
            totalDurationSeconds: 10,
            isPreview: false,
            orderIndex: 4,
            resource: {
              resourceId: '3004',
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
  userId: 'user_001',
  courseId: '2002',
  studentId: 'user_001',
  status: 'ENROLLED',
  progressRate: 0,
  createdAt: '2025-12-02T09:00:00',
  expiredAt: '2026-01-01T09:00:00',
};

export const MOCK_LEARN_PROGRESS: UpdateProgressResponse = {
  enrollmentId: '5001',
  progressRate: 5,

  lastVideoId: '3001',
  lastWatchedDuration: 5,
  lastWatchedAt: '2025-12-02T09:30:00',

  lectureProgresses: [
    {
      resourceId: '3001',
      title: 'JPA란?',
      currentProgressRate: 50,
      watchedDuration: 5,
      totalDurationSeconds: 10,
      isCompleted: false,
      lastWatchedAt: '2025-12-02T09:30:00',
    },
    {
      resourceId: '3002',
      title: '엔티티 매핑',
      currentProgressRate: 0,
      watchedDuration: 0,
      totalDurationSeconds: 10,
      isCompleted: false,
      lastWatchedAt: '2025-12-02T09:40:00',
    },
    {
      resourceId: '3003',
      title: '엔티티 매핑',
      currentProgressRate: 0,
      watchedDuration: 0,
      totalDurationSeconds: 10,
      isCompleted: false,
      lastWatchedAt: '2025-12-02T09:40:00',
    },
    {
      resourceId: '3004',
      title: '엔티티 매핑',
      currentProgressRate: 0,
      watchedDuration: 0,
      totalDurationSeconds: 10,
      isCompleted: false,
      lastWatchedAt: '2025-12-02T09:40:00',
    },
  ],

  updatedAt: '2025-12-02T09:30:00',
};
