export const getEnrollmentProgressRate = (e: {
  progressRate?: number;
  overallProgressRate?: number;
}) => e.overallProgressRate ?? e.progressRate ?? 0;
