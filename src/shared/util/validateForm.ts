// 타입 정의
type FormValue = string | number | string[] | null | undefined;

// 공백/빈값/빈배열 체크
export const isEmpty = (value: FormValue): boolean => {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'number') return false;
  return !value || !String(value).trim();
};

// formData 전체 검사
export const validateForm = (fields: Record<string, FormValue>): boolean =>
  Object.values(fields).some(isEmpty);
