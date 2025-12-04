export type SignUpForm = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export type LoginForm = {
  email: string
  password: string
}

/** 회원가입 요청에 사용할 Request 타입 */
export type SignUpRequest = {
  email: string
  password: string
  displayName?: string
}

/** 로그인 요청에 사용할 Request 타입 */
export type LoginRequest = {
  email: string
  password: string
}

/** Firebase Auth 기준으로 우리가 사용하는 유저 응답 타입 (Response) */
export type AuthUserResponse = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}
