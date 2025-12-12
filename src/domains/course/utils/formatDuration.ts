export const formatDuration = (totalMinutes: number): string => {
  if (!totalMinutes || totalMinutes <= 0) return '0분';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
};

/** 강의 재생용 (초 단위 → mm:ss) */
export const formatLectureDuration = (totalSeconds: number): string => {
  if (!totalSeconds || totalSeconds <= 0) return '00:00';

  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};
