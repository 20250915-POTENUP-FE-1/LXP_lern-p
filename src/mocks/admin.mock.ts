import { http, HttpResponse, PathParams } from 'msw';
import type { ApiResponse } from '@/shared/lib/api/fetchApi';
import type {
  GetAdminCoursesResponse,
  GetAdminCourseDetailResponse,
  AdminCourseItem,
  AdminCourseDetail,
} from '@/domains/admin/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

// 공통 응답 헬퍼
const ok = <T>(data: T): ApiResponse<T> => ({
  status: '200',
  code: 'SU001',
  message: '성공',
  data,
});

// Mock 강좌 데이터
const mockAdminCourses: AdminCourseItem[] = [
  {
    courseId: 'course-1',
    title: 'React 완벽 가이드 - 기초부터 실전까지',
    instructorName: '김리액트',
    categories: ['프론트엔드', 'React'],
    rating: 4.5,
    studentCount: 1234,
    reviewCount: 89,
    aiSummary: {
      sentiment: 'POSITIVE',
      positive: '설명이 친절하고 예제가 풍부합니다.',
      negative: '후반부 난이도가 급상승합니다.',
      suggestion: '중급 브릿지 강의 추가가 필요합니다.',
    },
    needsAttention: false,
  },
  {
    courseId: 'course-2',
    title: 'Next.js 14 마스터 클래스',
    instructorName: '박넥스트',
    categories: ['프론트엔드', 'Next.js'],
    rating: 4.8,
    studentCount: 856,
    reviewCount: 67,
    aiSummary: {
      sentiment: 'POSITIVE',
      positive: '최신 기술 트렌드를 잘 반영했습니다.',
      negative: '특별한 부정적 의견이 없습니다.',
      suggestion: '더 많은 실습 프로젝트 추가를 권장합니다.',
    },
    needsAttention: false,
  },
  {
    courseId: 'course-3',
    title: 'TypeScript 실전 입문',
    instructorName: '이타입',
    categories: ['프론트엔드', 'TypeScript'],
    rating: 2.1,
    studentCount: 45,
    reviewCount: 23,
    aiSummary: {
      sentiment: 'NEGATIVE',
      positive: '기초 개념 설명은 괜찮습니다.',
      negative: '영상 품질이 낮고 설명이 부족합니다.',
      suggestion: '영상 재촬영 및 실습 예제 보강이 필요합니다.',
    },
    needsAttention: true,
  },
  {
    courseId: 'course-4',
    title: 'Node.js 백엔드 개발',
    instructorName: '최노드',
    categories: ['백엔드', 'Node.js'],
    rating: 3.9,
    studentCount: 678,
    reviewCount: 45,
    aiSummary: {
      sentiment: 'NEUTRAL',
      positive: '실무 예제가 도움이 됩니다.',
      negative: '업데이트가 필요한 부분이 있습니다.',
      suggestion: '최신 Node.js 버전에 맞게 업데이트 권장합니다.',
    },
    needsAttention: false,
  },
  {
    courseId: 'course-5',
    title: 'Python 데이터 분석 기초',
    instructorName: '정파이썬',
    categories: ['데이터 사이언스', 'Python'],
    rating: 4.2,
    studentCount: 2345,
    reviewCount: 156,
    aiSummary: {
      sentiment: 'POSITIVE',
      positive: '입문자에게 적합한 난이도입니다.',
      negative: '고급 내용이 부족합니다.',
      suggestion: '심화 과정 연계 안내가 필요합니다.',
    },
    needsAttention: false,
  },
  {
    courseId: 'course-6',
    title: 'AWS 클라우드 실습',
    instructorName: '강클라우드',
    categories: ['DevOps', 'AWS'],
    rating: 2.8,
    studentCount: 123,
    reviewCount: 34,
    aiSummary: {
      sentiment: 'NEGATIVE',
      positive: '주제 선정이 좋습니다.',
      negative: '비용 관련 안내가 부족하고 실습 따라하기 어렵습니다.',
      suggestion: '무료 티어 활용법과 단계별 가이드 보강이 필요합니다.',
    },
    needsAttention: true,
  },
  {
    courseId: 'course-7',
    title: 'Docker & Kubernetes 입문',
    instructorName: '김도커',
    categories: ['DevOps', 'Docker'],
    rating: 4.6,
    studentCount: 567,
    reviewCount: 78,
    aiSummary: {
      sentiment: 'POSITIVE',
      positive: '체계적인 커리큘럼과 실습이 좋습니다.',
      negative: 'Windows 환경에서의 설명이 부족합니다.',
      suggestion: 'Windows 사용자를 위한 보충 자료 추가를 권장합니다.',
    },
    needsAttention: false,
  },
  {
    courseId: 'course-8',
    title: 'Java Spring Boot 마스터',
    instructorName: '박자바',
    categories: ['백엔드', 'Java'],
    rating: 4.1,
    studentCount: 890,
    reviewCount: 92,
    aiSummary: {
      sentiment: 'POSITIVE',
      positive: '실무 중심의 강의입니다.',
      negative: '기초 설명이 다소 빠릅니다.',
      suggestion: '입문자를 위한 사전 학습 가이드 추가를 권장합니다.',
    },
    needsAttention: false,
  },
];

// Mock 강좌 상세 데이터 생성 함수
const getMockCourseDetail = (courseId: string): AdminCourseDetail | null => {
  const course = mockAdminCourses.find((c) => c.courseId === courseId);
  if (!course) return null;

  return {
    ...course,
    ratingDistribution: [
      { rating: 5, count: 45, percentage: 50 },
      { rating: 4, count: 27, percentage: 30 },
      { rating: 3, count: 9, percentage: 10 },
      { rating: 2, count: 5, percentage: 6 },
      { rating: 1, count: 4, percentage: 4 },
    ],
  };
};

// 통계 계산
const calculateStats = () => {
  const totalCourses = mockAdminCourses.length;
  const totalStudents = mockAdminCourses.reduce((sum, c) => sum + c.studentCount, 0);
  const averageRating =
    mockAdminCourses.reduce((sum, c) => sum + c.rating, 0) / totalCourses;
  const needsAttentionCount = mockAdminCourses.filter((c) => c.needsAttention).length;

  return {
    totalCourses,
    averageRating,
    totalStudents,
    needsAttentionCount,
  };
};

export const adminHandlers = [
  // 관리자 대시보드 강좌 목록 조회
  http.get<PathParams, never, ApiResponse<GetAdminCoursesResponse>>(
    `${BASE_URL}/api/admin/courses`,
    async () => {
      const data: GetAdminCoursesResponse = {
        content: mockAdminCourses,
        stats: calculateStats(),
        currentPage: 0,
        size: 20,
        totalElements: mockAdminCourses.length,
        totalPages: 1,
        hasNext: false,
      };

      return HttpResponse.json<ApiResponse<GetAdminCoursesResponse>>(
        ok<GetAdminCoursesResponse>(data),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  ),

  // 관리자 대시보드 강좌 상세 조회
  http.get<{ courseId: string }, never, ApiResponse<GetAdminCourseDetailResponse | null>>(
    `${BASE_URL}/api/admin/courses/:courseId`,
    async ({ params }) => {
      const { courseId } = params;
      const detail = getMockCourseDetail(courseId);

      if (!detail) {
        return HttpResponse.json<ApiResponse<GetAdminCourseDetailResponse | null>>(
          {
            status: '404',
            code: 'EC404',
            message: '강좌를 찾을 수 없습니다.',
            data: null,
          },
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      return HttpResponse.json<ApiResponse<GetAdminCourseDetailResponse | null>>(
        ok<GetAdminCourseDetailResponse>(detail),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  ),
];
