import type { InstructorCourseListResponse } from '@/domains/course/types/instructor';

export const MOCK_INSTRUCTOR_COURSES: InstructorCourseListResponse = {
  content: [
    {
      courseId: '2',
      title: '스프링 부트 핵심 원리 - 입문편',
      categories: ['프로그래밍', '백엔드'],
      thumbnailUrl: 'https://cdn.example.com/images/courses/spring-boot-intro.png',
      status: 'PUBLISHED',
      price: 55000,
      studentCount: 1,
      rating: 5.0,
      lastModifiedAt: '2025-12-11T12:34:51.947554',
    },
    {
      courseId: '1',
      title: '스프링 입문 (작성중)',
      categories: ['프로그래밍', '백엔드'],
      thumbnailUrl: 'https://cdn.example.com/thumb.png',
      status: 'DRAFT',
      price: 55000,
      studentCount: 1,
      rating: 5.0,
      lastModifiedAt: '2025-12-11T12:36:02.767661',
    },
  ],
  currentPage: 0,
  size: 10,
  totalElements: 2,
  totalPages: 1,
  hasNext: false,
};
