// 값이 비어있는지 체크
export const isEmpty = (value) => !value || !String(value).trim();

// formData 객체 전체 검사
// 하나라도 비어있으면 true 반환
export const validateForm = (fields) => Object.values(fields).some(isEmpty);
