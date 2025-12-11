import { deleteApi, postApi } from '@/shared/lib/api/fetchApi'; // postApi만 사용
import type {
  SignUpRequest,
  LoginRequest,
  SignUpResponse,
  LoginResponse,
  SendEmailVerificationResponse,
  SendEmailVerificationRequest,
} from '../types/auth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * 회원가입
 */
export const signUp = async ({
  email,
  password,
  nickname,
}: SignUpRequest): Promise<SignUpResponse> => {
  const response = await fetch(`${BASE_URL}/api/auth/signup-and-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, nickname }),
  });

  if (!response.ok) {
    throw new Error(`회원가입 실패: ${response.statusText}`);
  }

  const resJson = await response.json();
  return resJson.data;
};

/**
 * 로그인
 */
export const login = async ({ email, password }: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`로그인 실패: ${response.statusText}`);
  }

  const resJson = await response.json();
  return resJson.data;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  return await postApi<void>('/api/auth/logout', {});
};

/**
 * 계정 삭제
 */
export const deleteAccount = async (): Promise<void> => {
  return await deleteApi<void>('/api/users/me');
};

/**
 * 이메일 인증
 */
export const sendEmailVerification = async ({
  email,
}: SendEmailVerificationRequest): Promise<SendEmailVerificationResponse> => {
  const response = await fetch(`${BASE_URL}/api/auth/email-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`이메일 인증 실패: ${response.statusText}`);
  }

  const resJson = await response.json();
  return resJson.data;
};
