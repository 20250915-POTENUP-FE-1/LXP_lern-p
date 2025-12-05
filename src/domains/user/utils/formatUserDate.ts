type UserDateInput = string | number | Date | null | undefined;

export function formatUserDate(timestamp: UserDateInput): string | null {
  if (timestamp == null) return null;

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  if (isNaN(date.getTime())) return null;

  return `${date.getFullYear()}년 ${String(
    date.getMonth() + 1
  ).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
}
