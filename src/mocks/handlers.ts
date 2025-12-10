import { http, HttpResponse, PathParams } from 'msw';
import type {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  SendEmailVerificationRequest,
  SendEmailVerificationResponse,
} from '@/domains/auth/types/auth';
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  updateStudentToInstructorResponse,
  UserResponse,
} from '@/domains/user/types/user';
import type { ApiResponse } from '@/shared/lib/api/fetchApi';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

// 공통 응답 헬퍼
const ok = <T>(data: T): ApiResponse<T> => ({
  status: '200',
  code: 'SU001',
  message: '성공',
  data,
});

const errorBody = <T>(status: number, code: string, message: string): ApiResponse<T> => ({
  status: String(status),
  code,
  message,
  data: null as unknown as T,
});

// 공통 인증 헬퍼 (Authorization 헤더 존재 여부만 체크)
function requireAuth<T>(request: Request): HttpResponse<ApiResponse<T>> | null {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return HttpResponse.json<ApiResponse<T>>(errorBody<T>(401, 'EU401', '인증이 필요합니다.'), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // 모킹이니까 토큰 값까지는 굳이 검증 안 함.
  // 필요하면 여기서 authHeader.slice('Bearer '.length)로 값 확인 가능.
  return null;
}

// 모킹용 유저 상태
const mockUser: UserResponse = {
  id: 'mock',
  email: 'mock@test.com',
  nickname: '모킹테스트',
  roles: ['STUDENT'],
  createdAt: '2025-12-01T10:20:30',
};

export const handlers = [
  // --- 회원가입 ---
  http.post<PathParams, SignUpRequest, ApiResponse<SignUpResponse>>(
    `${BASE_URL}/api/auth/signup-and-login`,
    async ({ request }) => {
      const body = await request.json();
      const { email, password, nickname } = body;

      if (email && password && nickname) {
        const data: SignUpResponse = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          tokenType: 'Bearer',
          expiresIn: 3600,
          user: {
            nickname,
            roles: ['STUDENT'],
          },
        };

        return HttpResponse.json<ApiResponse<SignUpResponse>>(ok<SignUpResponse>(data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      return HttpResponse.json<ApiResponse<SignUpResponse>>(
        errorBody<SignUpResponse>(400, 'EG001', '회원가입 실패'),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    },
  ),

  // --- 로그인 ---
  http.post<PathParams, LoginRequest, ApiResponse<LoginResponse>>(
    `${BASE_URL}/api/auth/login`,
    async ({ request }) => {
      const body = await request.json();
      const { email, password } = body;

      if (email === 'mock@test.com' && password === '00000000') {
        const data: LoginResponse = {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          tokenType: 'Bearer',
          expiresIn: 3600,
          user: {
            nickname: mockUser.nickname,
            roles: mockUser.roles,
          },
        };

        return HttpResponse.json<ApiResponse<LoginResponse>>(ok<LoginResponse>(data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            // 필요하면 여기도 Authorization 넣어서 fetchApi 갱신 테스트 가능
            Authorization: 'new-mock-access-token',
          },
        });
      }

      return HttpResponse.json<ApiResponse<LoginResponse>>(
        errorBody<LoginResponse>(401, 'EU001', '로그인 실패'),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    },
  ),

  // --- 로그아웃 ---
  http.post<PathParams, never, ApiResponse<void>>(`${BASE_URL}/api/auth/logout`, async () => {
    // 모킹에선 그냥 성공만 응답
    return HttpResponse.json<ApiResponse<void>>(ok<void>(undefined as void), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // --- 프로필 조회 (인증 필요) ---
  http.get<PathParams, never, ApiResponse<UserResponse>>(
    `${BASE_URL}/api/users/me`,
    async ({ request }) => {
      const authError = requireAuth<UserResponse>(request);
      if (authError) return authError;

      return HttpResponse.json<ApiResponse<UserResponse>>(ok<UserResponse>(mockUser), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  ),

  // --- 프로필 업데이트 (닉네임 수정, 인증 필요) ---
  http.patch<PathParams, UpdateProfileRequest, ApiResponse<UpdateProfileResponse>>(
    `${BASE_URL}/api/users/me`,
    async ({ request }) => {
      const authError = requireAuth<UpdateProfileResponse>(request);
      if (authError) return authError;

      const body = await request.json();
      const { nickname } = body;

      const data: UpdateProfileResponse = { nickname };
      mockUser.nickname = nickname;

      return HttpResponse.json<ApiResponse<UpdateProfileResponse>>(
        ok<UpdateProfileResponse>(data),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    },
  ),

  // --- 계정 삭제 (인증 필요) ---
  http.delete<PathParams, never, ApiResponse<void>>(
    `${BASE_URL}/api/users/me`,
    async ({ request }) => {
      const authError = requireAuth<void>(request);
      if (authError) return authError;

      return HttpResponse.json<ApiResponse<void>>(ok<void>(undefined as void), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  ),

  // --- 수강생 → 강사 전환 (인증 필요, 관리자 or 본인 가정) ---
  http.post<PathParams, null, ApiResponse<updateStudentToInstructorResponse>>(
    `${BASE_URL}/api/admin/users/:userId/roles/instructor`,
    async ({ request, params }) => {
      const authError = requireAuth<updateStudentToInstructorResponse>(request);
      if (authError) return authError;

      const { userId } = params;

      const data: updateStudentToInstructorResponse = {
        userId: userId as string,
        roles: ['STUDENT', 'INSTRUCTOR'],
      };

      mockUser.roles = ['STUDENT', 'INSTRUCTOR'];

      return HttpResponse.json<ApiResponse<updateStudentToInstructorResponse>>(
        ok<updateStudentToInstructorResponse>(data),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    },
  ),

  // --- 이메일 인증 (비인증 엔드포인트) ---
  http.post<PathParams, SendEmailVerificationRequest, ApiResponse<SendEmailVerificationResponse>>(
    `${BASE_URL}/api/auth/email-verification`,
    async ({ request }) => {
      const body = (await request.json()) as SendEmailVerificationRequest;
      const { email } = body;

      if (!email) {
        return HttpResponse.json<ApiResponse<SendEmailVerificationResponse>>(
          errorBody<SendEmailVerificationResponse>(400, 'EE001', '이메일이 필요합니다.'),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      }

      // SendEmailVerificationResponse 구조에 맞게 필요시 수정
      const data = {} as SendEmailVerificationResponse;

      return HttpResponse.json<ApiResponse<SendEmailVerificationResponse>>(
        ok<SendEmailVerificationResponse>(data),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    },
  ),
];
