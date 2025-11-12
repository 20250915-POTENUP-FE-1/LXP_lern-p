// 공백/빈값/빈배열 체크
export const isEmpty = (value) => {
  if (Array.isArray(value)) return value.length === 0; // 배열 → 길이 체크
  if (typeof value === 'number') return false; // 숫자는 0이어도 비어있지 않음
  return !value || !String(value).trim(); // 문자열, null, undefined 처리
};

// formData 전체 검사
export const validateForm = (fields) => Object.values(fields).some(isEmpty);
