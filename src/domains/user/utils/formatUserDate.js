export const formatUserDate = (timestamp) => {
  if (!timestamp) return null;

  // Firestore Timestamp 또는 ISO 문자열 또는 Date 모두 처리
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일`;
};
