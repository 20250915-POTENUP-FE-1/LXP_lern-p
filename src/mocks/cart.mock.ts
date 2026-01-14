import type { GetCartResponse } from '@/domains/cart/types/cart';

export const MOCK_GET_CART: GetCartResponse = {
  cartId: 1,
  items: [
    {
      cartItemId: 10101,
      courseId: 2001,
      courseTitle: 'Spring Boot 완벽 가이드1',
      instructorName: '김백엔드',
      price: 55000,
      thumbnailUrl: 'https://example.com/thumbnails/course_2002.png',
    },
    {
      cartItemId: 10102,
      courseId: 2003,
      courseTitle: 'React & Next.js 완전 정복',
      instructorName: '이프론트',
      price: 89000,
      thumbnailUrl: 'https://example.com/thumbnails/course_2003.png',
    },
    {
      cartItemId: 10103,
      courseId: 2004,
      courseTitle: '데이터베이스 기초',
      instructorName: '박디비',
      price: 59000,
      thumbnailUrl: 'https://example.com/thumbnails/course_2004.png',
    },
  ],
  totalAmount: 247000, // 99000 + 89000 + 59000
};
