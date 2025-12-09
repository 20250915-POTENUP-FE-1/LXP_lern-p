import { Role } from 'firebase/ai';

export type SignUpForm = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  email: string;
  password: string;
  nickname?: string;
};

export type SignUpResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    nickname: string;
    roles: Role[];
  };
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = SignUpResponse;

export type RoleResponse = {
  userId: string;
  roles: Role[];
};
