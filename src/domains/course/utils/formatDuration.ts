export const formatDuration = (totalMinutes: number): string => {
  if (!totalMinutes || totalMinutes <= 0) return '0분';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
};
