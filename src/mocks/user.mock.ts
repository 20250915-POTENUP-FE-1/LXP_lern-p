import { User } from '@/domains/user/types/user';

export const MOCK_USER: User = {
  id: 'user_001',
  email: 'ori@test.com',
  nickname: '김오리',
  roles: ['STUDENT', 'INSTRUCTOR'],
  cart: ['2002', '2003', '2004'],
  enrolledCourses: [],
  createdCourses: [],
  createdAt: new Date('2026-01-01T09:00:00Z'),
};
