export const getEnrollmentProgressRate = (e: {
  // TODO: backend overallProgressRate 전환 완료 시 progressRate fallback 제거
  progressRate?: number;
  overallProgressRate?: number;
}) => e.overallProgressRate ?? e.progressRate ?? 0;
