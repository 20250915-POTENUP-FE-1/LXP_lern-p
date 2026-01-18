import type { LearnCourseResponse } from '@/domains/course/types/learn';
import { GetProgressResponse } from '@/domains/course/types/progress';

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

export const MOCK_LEARN_PROGRESS: GetProgressResponse = {
  enrollmentId: '5002',
  overallProgressRate: 5,
  lastWatchedResourceId: '3001', // 마지막으로 재생했던 Video ID
  lastWatchedAt: '2025-12-02T09:30:00',
  lectureProgresses: [
    {
      resourceId: '3001',
      title: 'JPA란?',
      progressRate: 50,
      watchedDuration: 5,
      totalDurationSeconds: 10,
      completed: false,
      lastWatchedAt: '2025-12-02T09:30:00',
    },
    {
      resourceId: '3002',
      title: '엔티티 매핑',
      progressRate: 0,
      watchedDuration: 0,
      totalDurationSeconds: 10,
      completed: false,
      lastWatchedAt: '2025-12-02T09:40:00',
    },
    {
      resourceId: '3003',
      title: '엔티티 매핑',
      progressRate: 0,
      watchedDuration: 0,
      totalDurationSeconds: 10,
      completed: false,
      lastWatchedAt: '2025-12-02T09:40:00',
    },
    {
      resourceId: '3004',
      title: '엔티티 매핑',
      progressRate: 0,
      watchedDuration: 0,
      totalDurationSeconds: 10,
      completed: false,
      lastWatchedAt: '2025-12-02T09:40:00',
    },
  ],
};
