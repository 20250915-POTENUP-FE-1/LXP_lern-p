// src/domains/course/utils/formatDuration.ts

// 총 분(minute)을 "1시간 20분" 같은 문자열로 변환
export const formatDuration = (minutes: number): string => {
  if (!minutes || minutes <= 0) return '0분'

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}분`
  if (mins === 0) return `${hours}시간`
  return `${hours}시간 ${mins}분`
}
