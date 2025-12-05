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

/** 회원가입 요청에 사용할 Request 타입 */
export type SignUpRequest = {
  email: string;
  password: string;
  displayName?: string;
};

/** 로그인 요청에 사용할 Request 타입 */
export type LoginRequest = {
  email: string;
  password: string;
};
