export type GetProgressResponse = {
  resourceId: string;
  title: string;
  currentProgressRate: number;
  watchedDuration: number;
  totalDurationSeconds: number;
  isCompleted: boolean;
  lastWatchedAt: string | null;
};

export type UpdateProgressResponse = {
  enrollmentId: string;
  progressRate: number;
  lastVideoId: string | null;
  lastWatchedDuration: number;
  lastWatchedAt: string | null;
  lectureProgresses: GetProgressResponse[];
  updatedAt: string;
};

export type UpdateProgressRequest = {
  resourceId: string;
  watchedDuration: number;
};

// 이어보기 정보
export type ProgressInfo = {
  lectureId: string;
  resumeAt: number;
};

// Map에 들어갈 progress 값
export type LectureProgressMapValue = {
  progressRate: number;
  watchedDuration: number;
  totalDurationSeconds: number;
  completed: boolean;
};

// useProgress 반환 타입
export type CourseLearnProgress = {
  enrollmentId: string;
  overallProgressRate: number;
  progressInfo: ProgressInfo | null;
  lectureProgressMap: Map<string, LectureProgressMapValue>;
};

// 진도율 갱신 보류
export type PendingProgress = {
  resourceId: string;
  watchedDuration: number;
  retryCount: number;
};
