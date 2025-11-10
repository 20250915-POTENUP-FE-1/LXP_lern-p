export const validateSignUp = ({ name, email, password, passwordConfirm }) => {
  if (!name || !email || !password) {
    return '모든 필드를 입력해주세요.';
  }

  if (password.length < 6) {
    return '비밀번호는 6자 이상이어야 합니다.';
  }

  if (password !== passwordConfirm) {
    return '비밀번호가 일치하지 않습니다.';
  }

  return null;
};
